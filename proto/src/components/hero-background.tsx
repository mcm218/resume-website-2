import { getImageProps } from 'next/image';
import desktop from '@/assets/hero-desktop.jpg';
import phone from '@/assets/hero-phone.jpg';

// Art-directed LCP hero: real <picture>, eager + fetchPriority=high, no preload
// (two viewport-dependent candidates). Sits behind the content; the Angular site
// used a CSS background resized by JS after paint.
export function HeroBackground() {
  const common = { alt: '', sizes: '100vw', fetchPriority: 'high' as const, loading: 'eager' as const };
  const { props: { srcSet: desktopSet } } = getImageProps({ ...common, src: desktop, quality: 60 });
  const { props: { srcSet: phoneSet, ...rest } } = getImageProps({ ...common, src: phone, quality: 55 });
  return (
    <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 block w-full">
      <source media="(min-width: 601px)" srcSet={desktopSet} />
      <img {...rest} srcSet={phoneSet} className="h-auto w-full" />
    </picture>
  );
}
