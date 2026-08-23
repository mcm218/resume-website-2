import { SKILL_IDS } from '@/data/skills';
import * as Fa from './icons.generated';
import * as Hand from './icons.hand';
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
type IconFn = (p: P) => React.JSX.Element;

const SKILL_ICON: Record<(typeof SKILL_IDS)[number], IconFn> = {
  csharp: Hand.Svg_csharp, unity: Fa.Fa_unity, xamarin: Hand.Svg_xamarin, salesforce: Fa.Fa_salesforce,
  angular: Fa.Fa_angular, html: Fa.Fa_html, css: Fa.Fa_css, javascript: Fa.Fa_javascript,
  typescript: Hand.Svg_typescript, nodejs: Fa.Fa_nodejs, react: Fa.Fa_react, flutter: Hand.Svg_flutter,
  cplusplus: Hand.Svg_cplusplus, elasticsearch: Hand.Svg_elasticsearch, 'react-native': Hand.Svg_reactNative,
  rabbitmq: Hand.Svg_rabbitmq,
};
const OTHER_ICON: Record<string, IconFn> = {
  envelope: Fa.Fa_envelope, linkedin: Fa.Fa_linkedin, github: Fa.Fa_github,
  'chevron-left': Fa.Fa_chevronLeft, 'chevron-right': Fa.Fa_chevronRight,
};

// Every icon defined exactly once as a <symbol>; the page references them with <use>.
// Each Fa_/Svg_ component renders an <svg viewBox=...><path/></svg>; we lift its
// viewBox and children into a <symbol>.
export function IconSprite() {
  const all = { ...SKILL_ICON, ...OTHER_ICON };
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {Object.entries(all).map(([id, Icon]) => {
          const el = Icon({});
          const { viewBox, children } = el.props as { viewBox: string; children: React.ReactNode };
          return <symbol key={id} id={`i-${id}`} viewBox={viewBox}>{children}</symbol>;
        })}
      </defs>
    </svg>
  );
}

export function Icon({ id, className = 'h-7 w-7', ...p }: { id: string } & P) {
  return <svg className={className} fill="currentColor" aria-hidden="true" {...p}><use href={`#i-${id}`} /></svg>;
}
