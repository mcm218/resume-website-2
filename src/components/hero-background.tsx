import { getImageProps } from 'next/image';
import desktop from '@/assets/hero-desktop.jpg';
import phone from '@/assets/hero-phone.jpg';

/**
 * The art-directed LCP hero: a real `<picture>`, eager and high priority, with no
 * `<link rel=preload>` — the two candidates are viewport-dependent, so preloading
 * would fetch the wrong one. The Angular site used a CSS background that JavaScript
 * resized after paint.
 */
export function HeroBackground() {
  const common = {
    alt: '',
    sizes: '100vw',
    fetchPriority: 'high' as const,
    loading: 'eager' as const,
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktop, quality: 60 });
  const {
    props: { srcSet: phoneSrcSet, ...phoneProps },
  } = getImageProps({ ...common, src: phone, quality: 55 });

  return (
    <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 block w-full">
      <source media="(min-width: 601px)" srcSet={desktopSrcSet} />
      <img {...phoneProps} alt="" srcSet={phoneSrcSet} className="h-auto w-full" />
    </picture>
  );
}
