import { resume } from '@/data/resume';
import { HeroBackground } from '@/components/hero-background';
import { SiteHeader } from '@/components/site-header';
import { FilterToolbar } from '@/components/filter-toolbar';
import { IconSprite } from '@/components/icon-sprite';
import { ExperienceGroupSection } from '@/components/experience';
import { SkillsSection } from '@/components/skills';

export default function Home() {
  return (
    <main className="relative isolate min-h-svh overflow-x-clip pb-[200px]">
      <IconSprite />
      <HeroBackground />
      {/* Mobile gradient underlay (pure CSS; Angular sized it with JS) */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-svh bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.8)_80%,#000_100%)] sm:hidden" />
      <FilterToolbar />
      <div className="primary-column mx-auto flex max-w-[1920px] flex-col gap-[12.5rem] px-4 transition-[padding-left] duration-250 data-[expanded=true]:pl-[102px] max-sm:px-0">
        <SiteHeader />
        {resume.experience.map((g, i) => (
          <div key={g.title} className={`rounded-[var(--radius-card)] bg-black/70 ${i % 2 === 0 ? 'self-start' : 'self-end'}`}>
            <ExperienceGroupSection group={g} />
          </div>
        ))}
        <div className="w-full rounded-[var(--radius-card)] bg-black/70">
          <SkillsSection blocks={resume.skillBlocks} />
        </div>
      </div>
    </main>
  );
}
