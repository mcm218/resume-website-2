import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from "@sentry/angular-ivy";
import { AppModule } from './app/app.module';
import packageJSON from "../package.json";

// import { environment } from './environments/environment.js';

// if (environment.production) {
//   enableProdMode();
// }

Sentry.init({
  release: "resume-website@" + packageJSON.version,
  dsn: "https://953f62f29e44de26fab8242656793fa5@o4506140418441216.ingest.sentry.io/4506140429516800",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", "https://wild-sun-3772.fly.dev/", "https://michaelcmuniz.com", "https://resume.michaelcmuniz.com"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

enableProdMode();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((success) => console.error(`Hello Sentry`))
  .catch(err => console.error(err));
