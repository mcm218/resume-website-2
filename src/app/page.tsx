import { HeroBackground } from '@/components/hero-background';
import { IconSprite } from '@/components/icon-sprite';
import { resume } from '@/data/resume';

const { name, title } = resume.contact;

export default function Home() {
  return (
    <main className="relative isolate min-h-svh overflow-x-clip pb-[200px]">
      <IconSprite />
      <HeroBackground />
      {/* Mobile gradient underlay; the Angular site sized this with screen.availHeight. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-svh bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.8)_80%,#000_100%)] sm:hidden"
      />
      <div className="primary-column mx-auto flex max-w-[1920px] flex-col gap-[12.5rem] px-4 max-sm:px-0">
        <header className="pt-[145px]">
          <h1>{name}</h1>
          <h2>{title}</h2>
        </header>
      </div>
    </main>
  );
}
