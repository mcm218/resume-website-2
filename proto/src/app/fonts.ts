import localFont from 'next/font/local';

// Only the 200 weight (h1/h2, above the fold) is preloaded; 300/400 load on demand.
export const montserrat = localFont({
  src: [{ path: './fonts/Montserrat-ExtraLight.subset.woff2', weight: '200', style: 'normal' }],
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
  variable: '--font-montserrat',
});

export const montserratBody = localFont({
  src: [
    { path: './fonts/Montserrat-Light.subset.woff2', weight: '300', style: 'normal' },
    { path: './fonts/Montserrat-Regular.subset.woff2', weight: '400', style: 'normal' },
  ],
  display: 'swap',
  preload: false,
  adjustFontFallback: 'Arial',
  variable: '--font-montserrat-body',
});
