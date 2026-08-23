import { IconSprite, Icon } from '@/components/icon-sprite';
import { ICON_IDS } from '@/components/icons';
import { resume } from '@/data/resume';

const { name } = resume.contact;

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-12 p-8">
      <IconSprite />
      <h1 className="text-4xl font-extralight tracking-[0.3rem] text-blue">{name}</h1>
      {/* Temporary: proves every symbol renders. Removed by the cards and skills tickets. */}
      <ul className="flex max-w-3xl flex-wrap justify-center gap-6">
        {ICON_IDS.map((id) => (
          <li key={id} className="flex w-24 flex-col items-center gap-2 text-grayblue">
            <Icon id={id} className="h-8 w-8" />
            <span className="text-xs text-gray">{id}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
