import { resume } from '@/data/resume';
import { Icon } from './icon-sprite';

const { name, title, email, linkedin, github } = resume.contact;

function HeaderContent() {
  return (
    <div className="grid grid-cols-1 px-2 py-0 sm:grid-cols-[auto_auto] sm:px-4">
      <section className="pt-0">
        <h1 className="hdr-title">{name}</h1>
        <h2 className="hdr-fade overflow-hidden">{title}</h2>
      </section>
      <section className="hdr-fade overflow-hidden">
        <nav aria-label="Contact" className="flex flex-wrap gap-5 sm:flex-row-reverse">
          <a href={`mailto:${email}`} aria-label={`Email ${email}`}>
            <Icon id="envelope" className="h-8 w-8" />
          </a>
          <a href={linkedin} aria-label="LinkedIn profile">
            <Icon id="linkedin" className="h-8 w-8" />
          </a>
          <a href={github} aria-label="GitHub profile">
            <Icon id="github" className="h-8 w-8" />
          </a>
        </nav>
      </section>
    </div>
  );
}

/**
 * The header the Angular site animated from JavaScript scroll handlers: it shrinks
 * onto a black bar as the page scrolls, and the subtitle and contact links collapse
 * away. Here it is pure CSS (see the scroll-driven block in `globals.css`), so it
 * costs nothing at runtime and keeps its initial state where the feature is missing.
 *
 * Because the bar is fixed, the flow needs a spacer as tall as the header's resting
 * height. That height depends on how the name wraps, so the spacer is a second,
 * inert copy of the same content rather than a hard-coded height that only matches
 * at one viewport width.
 */
export function SiteHeader() {
  return (
    <>
      <header className="hdr fixed inset-x-0 top-0 z-20 p-0 text-black">
        <HeaderContent />
      </header>
      <div aria-hidden="true" inert className="invisible p-0">
        <HeaderContent />
      </div>
    </>
  );
}
