# Lighthouse CI against Vercel previews (mobile + desktop, minScore 1)

Research for [#4](https://github.com/mcm218/resume-website-2/issues/4), part of [#3](https://github.com/mcm218/resume-website-2/issues/3).
Date: 2026-08-23. All claims are sourced to primary docs or source code; links are to `main` at time of reading.

## TL;DR

- Use `treosh/lighthouse-ci-action@v12` (bundles `@lhci/cli` + Lighthouse 12.6, runs on the runner's preinstalled Chrome, fails the job on assertion failures, and can upload the HTML reports as artifacts). Hand-rolling `@lhci/cli` buys nothing here.
- Trigger the workflow on GitHub's `deployment_status` event, which Vercel's GitHub integration emits for every preview deployment. Read the preview URL from `github.event.deployment_status.environment_url`. The workflow file must live on `main` for this event to fire.
- Run two jobs from a matrix (`mobile`, `desktop`), each with its own `lighthouserc.<form-factor>.json`. Desktop is `settings.preset: "desktop"`, which is Lighthouse's own desktop config (desktop form factor, desktop screen emulation, `desktopDense4G` throttling, desktop UA).
- Assert `categories:performance|accessibility|best-practices|seo` at `minScore: 1`. Use `numberOfRuns: 3`, `aggregationMethod: "median"` for performance (the only noisy category), `"pessimistic"` for the three deterministic categories.
- Two preview-only traps, both verified against source: Vercel sends `X-Robots-Tag: noindex` on every preview, which fails Lighthouse's `is-crawlable` audit and caps SEO below 100. Fix: `settings.skipAudits: ["is-crawlable"]` (skipped audits are removed from the category's `auditRefs`, so the score is computed without them). And Deployment Protection (Vercel Authentication, on by default) blocks Lighthouse entirely; either disable it for this project or send the `x-vercel-protection-bypass` header.

## 1. Action choice: `treosh/lighthouse-ci-action` vs raw `@lhci/cli`

| | `treosh/lighthouse-ci-action@v12` | `npm i -g @lhci/cli && lhci autorun` |
|---|---|---|
| Lighthouse version | pinned to "Lighthouse v12.6" ([README][treosh]) | whatever `@lhci/cli` depends on at install time |
| Chrome | uses the runner's preinstalled Chrome ([README][treosh]) | same, but you manage flags |
| Config | `configPath` points at a `lighthouserc` file; `runs`/`urls` inputs override it ([README][treosh]; [src/config.js][treosh-config] shows `runs` input > `ci.collect.numberOfRuns` > `1`) | `lighthouserc.json` discovered from cwd ([configuration.md][lhci-config]) |
| Failing the job | "will fail the build" on failed assertions or budgets ([README][treosh]) | `lhci assert` exits non-zero |
| Reports | `uploadArtifacts: true` saves `.lighthouseci/` as a workflow artifact; `temporaryPublicStorage: true` uploads to GCS, auto-deleted after ~7 days ([README][treosh]) | `ci.upload.target` |
| Outputs | `resultsPath`, `links`, `assertionResults`, `manifest` ([README][treosh]) | none |
| Status checks | none built in | `LHCI_GITHUB_APP_TOKEN` posts GitHub status checks ([getting-started.md][lhci-gs]) |

Decision: the action. The repo does not need the LHCI GitHub App because the job itself is the status check (see section 2). Everything else the action does for free.

Note on the README's advanced-config recipe: it shows `emulatedFormFactor: 'desktop'` inside a separate `lighthouse-config.js` ([README][treosh]). That key is stale; current Lighthouse exposes `--form-factor` and says "For desktop, use `--preset=desktop` instead" ([Lighthouse readme CLI options][lh-readme]). Use `preset`.

## 2. Getting the preview URL: `deployment_status` vs `repository_dispatch` vs `vercel` CLI

Vercel's GitHub integration "deploys every push by default", including PR branches, and "uses the deployment API", so "Vercel will provide the deployment URL to the checks that require it" ([Vercel for GitHub][vercel-gh]).

Three ways to obtain the URL in a workflow:

1. **`deployment_status` event (recommended).** "By default, Vercel notifies GitHub of deployments using the `deployment_status` webhook event" ([Vercel for GitHub][vercel-gh]). Vercel's own migration diff shows the idiomatic guard and URL access: `if: github.event_name == 'deployment_status' && github.event.deployment_status.state == 'success'` and `${{ github.event.deployment_status.environment_url }}` ([Vercel for GitHub][vercel-gh]). For this event GitHub sets `GITHUB_SHA` to the "Commit to be deployed" ([GitHub events doc][gh-events]), so the run attaches to the PR's head commit and shows up in the PR's Checks tab, where it can be made a required check. Caveats: "This event will only trigger a workflow run if the workflow file exists on the default branch" ([GitHub events doc][gh-events]), and it fires for production deployments too, so filter on the environment name.
2. **`repository_dispatch` (`vercel.deployment.success`).** Vercel's newer mechanism, with `client_payload.url`, `client_payload.environment`, `client_payload.git.{ref,sha,shortSha}`, `client_payload.project.{name,id}` ([repository-dispatch types][vercel-rd-types]; [Vercel for GitHub][vercel-gh]). The drawback for PR gating: for `repository_dispatch`, `GITHUB_SHA` is the "Last commit on default branch" and `GITHUB_REF` is the "Default branch" ([GitHub events doc][gh-events]), so the run does not appear as a check on the PR commit unless you post a commit status yourself against `client_payload.git.sha`. Keep this in the back pocket if `deployment_status` events are ever disabled in the Vercel project's Git settings (Vercel lets you turn them off and "encourage[s] migrating to `repository_dispatch`" ([Vercel for GitHub][vercel-gh])).
3. **`vercel` CLI from the workflow** (`vercel pull` / `vercel build` / `vercel deploy --prebuilt`). Documented for GitHub Enterprise Server or custom CI ([Vercel for GitHub][vercel-gh]). It means running the deploy from Actions and managing a `VERCEL_TOKEN`; unnecessary when the Git integration already deploys every push.

## 3. Deployment Protection on previews

"On the Hobby plan, Vercel Authentication with Standard Protection is available. This protects your preview deployments and deployment URLs, but your production domain remains publicly accessible" ([Deployment Protection][vercel-dp]). Vercel Authentication is "Available on all plans" and Standard Protection "Protects all deployments except production domains" ([Deployment Protection][vercel-dp]). If it is on, Lighthouse gets the Vercel login page instead of the site.

Two options:

- **Turn protection off for this project** (Settings → Deployment Protection → None). Simplest; a public resume site's previews hold nothing sensitive. The config below assumes this.
- **Keep it on and bypass.** "Protection Bypass for Automation enables you to run automated tests, CI/CD pipelines, and monitoring tools against your protected deployments"; authenticate "using either an HTTP header or a query parameter named `x-vercel-protection-bypass`"; the header is "the recommended approach". For follow-up requests in a browser add `x-vercel-set-bypass-cookie: true` ([Protection Bypass for Automation][vercel-bypass]). Vercel's E2E guide repeats: "If your project has Deployment Protection enabled, ensure you use Protection Bypass for Automation" ([E2E after preview][vercel-e2e]). Lighthouse accepts `--extra-headers` as a JSON object ([Lighthouse readme][lh-readme]); LHCI forwards everything under `ci.collect.settings` to Lighthouse via `--cli-flags-path` ([lhci node-runner.js][lhci-runner]), so `settings.extraHeaders: {...}` works. Because the secret cannot be committed, switch the config to `lighthouserc.<ff>.cjs` (LHCI loads `.js`/`.cjs` rc files too, [configuration.md][lhci-config]; the action uses LHCI's own `loadRcFile`, [treosh src/config.js][treosh-config]) and read `process.env.VERCEL_AUTOMATION_BYPASS_SECRET`, populated from a repo secret. Snippet in section 7.

## 4. Mobile and desktop

- Mobile is Lighthouse's default (Moto G Power emulation, simulated slow 4G) ([constants.js][lh-constants]).
- Desktop: `preset: "desktop"` is a Lighthouse CLI flag (`--preset`, choices `perf`/`experimental`/`desktop`; ignored if `--config-path` is also given) ([Lighthouse readme][lh-readme]). The preset is `extends: 'lighthouse:default'` with `formFactor: 'desktop'`, `throttling: desktopDense4G`, `screenEmulation: desktop`, `emulatedUserAgent: desktop` ([desktop-config.js][lh-desktop]).
- LHCI's `ci.collect.settings` is documented as "The Lighthouse CLI flags to pass along to Lighthouse" ([configuration.md][lhci-config]) and the action forwards `configPath` to LHCI, so `settings.preset` is all that is needed; no second Lighthouse config file.
- One action invocation takes one `configPath`, so two form factors means two invocations. Lighthouse's variability guide says "DO NOT collect multiple Lighthouse reports at the same time on the same machine" ([variability.md][lh-var]), so make them two matrix jobs (separate runners) rather than two steps in one job. Sequential steps in one job would also be fine, just slower.

## 5. Assertions and variance

Assertion syntax: `"categories:<id>": ["error", {"minScore": 1}]`; defaults when no options are given are `{"aggregationMethod": "optimistic", "minScore": 1}` ([configuration.md][lhci-config]).

Aggregation methods, verbatim ([configuration.md][lhci-config]):

- `median` - Use the median value from all runs.
- `optimistic` - Use the value that is most likely to pass from all runs.
- `pessimistic` - Use the value that is least likely to pass from all runs.
- `median-run` - Use the value of the run that was determined to be "most representative" of all runs based on key performance metrics.

Variance facts:

- LHCI's `numberOfRuns` default is 3, described as helping "mitigate fluctuations due to natural page variability" ([configuration.md][lhci-config]). The action's own default is 1 with the warning "Asserting against a single run can lead to flaky performance assertions" ([README][treosh]); the action reads `numberOfRuns` from the rc file if its `runs` input is unset ([treosh src/config.js][treosh-config]).
- "The median Lighthouse score of 5 runs is twice as stable as 1 run"; prefer "aggregate values like the median, 90th percentile, or even min/max instead of single test results" ([variability.md][lh-var]). High-impact variance sources listed there are page nondeterminism, local network, client hardware and client resource contention; GitHub-hosted runners are shared hardware, so some TBT/LCP jitter is expected.
- Performance score weights: FCP 10, LCP 25, TBT 30, CLS 25, SI 10 ([default-config.js][lh-default]). For a static, no-JS-heavy page these should sit at 100 with margin; if the median ever lands at 0.99, the first lever is 5 runs, the second is a targeted metric assertion (e.g. `"total-blocking-time": ["error", {"maxNumericValue": 200}]`) rather than lowering the category bar.

Recommendation:

- `numberOfRuns: 3` (5 if flakes appear; cost is ~40 s per extra run per form factor).
- `performance`: `median`. The category score is the thing being gated and `median` is the aggregate the Lighthouse team recommends.
- `accessibility`, `best-practices`, `seo`: `pessimistic`. These are deterministic for a static page; if any run disagrees, that is a real bug (e.g. a console error that only appears sometimes) and should fail.
- Do not use the `optimistic` default for a "must be 100" gate: it passes if any single run hits 100.

### Known preview-only or flaky audits to handle

| Audit | Category / weight | Why it bites on a Vercel preview | Handling |
|---|---|---|---|
| `is-crawlable` | SEO, weight 93/23 (the heaviest SEO audit) ([default-config.js][lh-default]) | "Vercel adds an `X-Robots-Tag: noindex` HTTP response header to every Preview Deployment automatically" ([Vercel KB][vercel-noindex]); the audit reads the `x-robots-tag` response header and fails on `noindex` ([is-crawlable.js][lh-crawlable]). Score cannot reach 100. | `settings.skipAudits: ["is-crawlable"]`. Skipped audits are removed from the audit list and categories are re-filtered to only the remaining audits ([filters.js][lh-filters]), so SEO is scored without it. Production (custom domain) is still `index`-able; confirm post-cutover with PSI. |
| `canonical` | SEO, weight 1 | A `<link rel=canonical>` pointing at `https://michaelcmuniz.com/` from a `*.vercel.app` preview. Checked: the audit only fails on relative/invalid/conflicting URLs, a different `hreflang` target, or pointing at the root from a non-root page ([canonical.js][lh-canonical]). A different host is fine. | Nothing. |
| `errors-in-console` | Best Practices, weight 1 ([default-config.js][lh-default]) | Any 4xx/5xx or runtime error on the preview (e.g. an analytics script that is disabled for the project, a missing asset) fails it. | Keep asserted; fix the root cause. This is the audit most likely to be nondeterministic, which is why `pessimistic` is used for Best Practices. |
| `third-party-cookies`, `deprecations`, `inspector-issues` | Best Practices, weights 5/5/1 | Third-party scripts. Vercel Analytics is first-party (`/_vercel/insights`), so not expected to trigger. | Keep asserted. |
| `redirects-http` | Best Practices, weight 1 | Only relevant if the URL audited is `http://`. `environment_url` is `https://`. | Nothing. |
| `target-size`, `color-contrast` | Accessibility, weight 7 each | Deterministic, but `target-size` is evaluated under the mobile viewport only, so mobile can fail where desktop passes. | Keep asserted; this is exactly why both form factors run. |
| `bf-cache`, `uses-http2`, `csp-xss`, `unsized-images` | weight 0 in their categories ([default-config.js][lh-default]) | Frequently cited as flaky, but they do not affect the 0-100 scores. | Ignore. Category assertions, not `lighthouse:all`, so weight-0 audits never fail the job. |

## 6. Ready-to-adopt config

Two rc files, identical except for the form factor. JSON is used so the action's `configPath` input works with no build step.

`lighthouserc.mobile.json`

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "skipAudits": ["is-crawlable"]
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 1, "aggregationMethod": "median" }],
        "categories:accessibility": ["error", { "minScore": 1, "aggregationMethod": "pessimistic" }],
        "categories:best-practices": ["error", { "minScore": 1, "aggregationMethod": "pessimistic" }],
        "categories:seo": ["error", { "minScore": 1, "aggregationMethod": "pessimistic" }]
      }
    }
  }
}
```

`lighthouserc.desktop.json`

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "skipAudits": ["is-crawlable"]
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 1, "aggregationMethod": "median" }],
        "categories:accessibility": ["error", { "minScore": 1, "aggregationMethod": "pessimistic" }],
        "categories:best-practices": ["error", { "minScore": 1, "aggregationMethod": "pessimistic" }],
        "categories:seo": ["error", { "minScore": 1, "aggregationMethod": "pessimistic" }]
      }
    }
  }
}
```

Notes:

- `url` is deliberately absent from the rc file; the workflow passes it via the action's `urls` input, which the action supports with env interpolation and which overrides `ci.collect.url` ([README][treosh]; [treosh src/config.js][treosh-config]).
- No `upload` block: the action handles artifact upload via `uploadArtifacts: true`.
- `chromeFlags` are not needed on `ubuntu-latest`; the action already appends `--headless=new` ([lhci node-runner.js][lhci-runner]). Add `"chromeFlags": "--no-sandbox"` only if Chrome fails to launch.

## 7. Workflow sketch

`.github/workflows/lighthouse.yml` (must be merged to `main` before it fires; until then use the `workflow_dispatch` input to test against any URL).

```yaml
name: Lighthouse

on:
  deployment_status:
  workflow_dispatch:
    inputs:
      url:
        description: URL to audit (e.g. a preview deployment)
        required: true

permissions:
  contents: read

concurrency:
  group: lighthouse-${{ github.event.deployment.sha || github.run_id }}
  cancel-in-progress: true

jobs:
  lighthouse:
    # Vercel emits deployment_status for production too; only audit successful Preview deployments.
    if: >-
      github.event_name == 'workflow_dispatch' ||
      (github.event_name == 'deployment_status' &&
       github.event.deployment_status.state == 'success' &&
       startsWith(github.event.deployment.environment, 'Preview'))
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        form_factor: [mobile, desktop]
    name: lighthouse (${{ matrix.form_factor }})
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.deployment.sha || github.sha }}

      - name: Resolve URL
        id: url
        run: echo "url=${{ github.event.inputs.url || github.event.deployment_status.environment_url }}" >> "$GITHUB_OUTPUT"

      - name: Lighthouse CI (${{ matrix.form_factor }})
        uses: treosh/lighthouse-ci-action@v12
        with:
          urls: |
            ${{ steps.url.outputs.url }}/
          configPath: ./lighthouserc.${{ matrix.form_factor }}.json
          uploadArtifacts: true
          artifactName: lighthouse-${{ matrix.form_factor }}
          temporaryPublicStorage: false
```

Why each piece:

- `deployment_status` + `state == 'success'` + `environment_url`: straight from Vercel's documented pattern ([Vercel for GitHub][vercel-gh]). `startsWith(..., 'Preview')` keeps production deploys out; Vercel names the GitHub deployment environment `Preview` (or `Preview – <project>` for multi-project repos).
- `checkout` with `github.event.deployment.sha` ensures the rc files audited match the deployed commit (for `deployment_status`, `GITHUB_SHA` is already the deployed commit per [GitHub events doc][gh-events], so this is belt-and-braces).
- Matrix of two jobs: separate runners, per the variability guide's "not at the same time on the same machine" rule ([variability.md][lh-var]).
- `fail-fast: false` so a mobile failure still produces the desktop report.
- `concurrency` keyed on the deployment SHA cancels superseded runs when Vercel redeploys the same commit.
- Make `lighthouse (mobile)` and `lighthouse (desktop)` required checks in a `main` branch ruleset once the workflow is on `main`.

If Deployment Protection stays on, replace the JSON rc files with `.cjs` and add the secret:

```js
// lighthouserc.mobile.cjs
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
        skipAudits: ['is-crawlable'],
        extraHeaders: {
          'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
          'x-vercel-set-bypass-cookie': 'true',
        },
      },
    },
    assert: { /* same as JSON above */ },
  },
};
```

and in the workflow step: `env: { VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }} }` with `configPath: ./lighthouserc.${{ matrix.form_factor }}.cjs`. Header names and the cookie flag are from [Protection Bypass for Automation][vercel-bypass].

## 8. Open items / things to verify once the Vercel project exists

- Confirm the GitHub deployment environment name Vercel uses for this project (expected `Preview`); adjust the `startsWith` guard if it differs.
- Confirm the project's Deployment Protection setting; pick JSON (off) or `.cjs` (bypass header) accordingly.
- After the first green run, look at the `performance` numeric values in the artifact for each form factor. If the median is not comfortably 100, go to `numberOfRuns: 5` before anything else.
- `skipAudits: ["is-crawlable"]` means CI never checks crawlability. Verify `index` on production with PageSpeed Insights after DNS cutover (tracked under "Not yet specified" in #3).

## Sources

[treosh]: https://github.com/treosh/lighthouse-ci-action/blob/main/README.md
[treosh-config]: https://github.com/treosh/lighthouse-ci-action/blob/main/src/config.js
[lhci-config]: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
[lhci-gs]: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md
[lhci-runner]: https://github.com/GoogleChrome/lighthouse-ci/blob/main/packages/cli/src/collect/node-runner.js
[lh-readme]: https://github.com/GoogleChrome/lighthouse/blob/main/readme.md
[lh-desktop]: https://github.com/GoogleChrome/lighthouse/blob/main/core/config/desktop-config.js
[lh-constants]: https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js
[lh-default]: https://github.com/GoogleChrome/lighthouse/blob/main/core/config/default-config.js
[lh-filters]: https://github.com/GoogleChrome/lighthouse/blob/main/core/config/filters.js
[lh-crawlable]: https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/seo/is-crawlable.js
[lh-canonical]: https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/seo/canonical.js
[lh-var]: https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md
[vercel-gh]: https://vercel.com/docs/git/vercel-for-github
[vercel-rd-types]: https://github.com/vercel/repository-dispatch/tree/main/packages/repository-dispatch/src
[vercel-dp]: https://vercel.com/docs/deployment-protection
[vercel-bypass]: https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
[vercel-e2e]: https://vercel.com/kb/guide/how-can-i-run-end-to-end-tests-after-my-vercel-preview-deployment
[vercel-noindex]: https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines
[gh-events]: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows

- treosh/lighthouse-ci-action README: [treosh], src/config.js: [treosh-config]
- GoogleChrome/lighthouse-ci configuration.md: [lhci-config], getting-started.md: [lhci-gs], node-runner.js: [lhci-runner]
- GoogleChrome/lighthouse readme: [lh-readme], desktop-config.js: [lh-desktop], constants.js: [lh-constants], default-config.js: [lh-default], filters.js: [lh-filters], is-crawlable.js: [lh-crawlable], canonical.js: [lh-canonical], variability.md: [lh-var]
- Vercel: Vercel for GitHub: [vercel-gh], repository-dispatch types: [vercel-rd-types], Deployment Protection: [vercel-dp], Protection Bypass for Automation: [vercel-bypass], E2E after preview KB: [vercel-e2e], preview noindex KB: [vercel-noindex]
- GitHub: events that trigger workflows: [gh-events]
