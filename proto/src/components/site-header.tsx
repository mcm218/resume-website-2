import { resume } from '@/data/resume';
import { Icon } from './icon-sprite';

export function SiteHeader() {
  const c = resume.contact;
  return (
    <>
      <header className="hdr fixed inset-x-0 top-0 z-20 p-0 text-black">
        <div className="grid grid-cols-1 px-2 py-0 sm:grid-cols-[auto_auto] sm:px-4">
          <section className="pt-0">
            <h1 className="hdr-title">{c.name}</h1>
            <h2 className="hdr-fade overflow-hidden">{c.title}</h2>
          </section>
          <section className="hdr-fade overflow-hidden">
            <nav aria-label="Contact" className="flex flex-wrap gap-5 sm:flex-row-reverse">
              <a href={`mailto:${c.email}`} aria-label={`Email ${c.email}`}><Icon id="envelope" className="h-8 w-8" /></a>
              <a href={c.linkedin} aria-label="LinkedIn profile"><Icon id="linkedin" className="h-8 w-8" /></a>
              <a href={c.github} aria-label="GitHub profile"><Icon id="github" className="h-8 w-8" /></a>
            </nav>
          </section>
        </div>
      </header>
      {/* Offset matching the header's initial height (was JS-measured in Angular). */}
      <div aria-hidden="true" className="h-[300px] sm:h-[145px]" />
    </>
  );
}
