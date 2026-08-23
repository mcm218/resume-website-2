import { resume } from '@/data/resume';

const { name } = resume.contact;

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center">
      <h1 className="text-4xl font-extralight tracking-[0.3rem] text-blue">{name}</h1>
    </main>
  );
}
