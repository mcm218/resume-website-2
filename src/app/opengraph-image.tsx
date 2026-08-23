import { ImageResponse } from 'next/og';
import { resume } from '@/data/resume';
import { socialTitle } from './seo';
import { PALETTE } from './theme';

export const alt = socialTitle(resume.contact);
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const { name, title, location } = resume.contact;
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          background: `linear-gradient(160deg, ${PALETTE.black} 0%, #001a24 60%, #00232f 100%)`,
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 88, letterSpacing: 6, fontWeight: 300 }}>{name}</div>
        <div style={{ fontSize: 44, letterSpacing: 4, color: PALETTE.blue, marginTop: 16 }}>
          {title}
        </div>
        <div style={{ fontSize: 30, letterSpacing: 2, color: PALETTE.grayblue, marginTop: 32 }}>
          {location}
        </div>
      </div>
    ),
    size,
  );
}
