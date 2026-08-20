import { MASCOTS, type MascotPose } from '../assets/mascots';

type MascotSize = 'hero' | 'page' | 'modal' | 'avatar' | 'status';

// Matches the responsive sizing recommendations in TOURMATE_MASCOT_PLACEMENT.md.
const SIZE_CLASSES: Record<MascotSize, string> = {
  hero: 'w-[clamp(280px,38vw,580px)]',
  page: 'w-[clamp(180px,25vw,360px)]',
  modal: 'w-[clamp(140px,20vw,260px)]',
  avatar: 'h-10 w-10',
  status: 'w-[72px]',
};

export function Mascot({
  pose,
  size = 'page',
  className = '',
  alt = 'TourMate mascot',
}: {
  pose: MascotPose;
  size?: MascotSize;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={MASCOTS[pose]}
      alt={alt}
      draggable={false}
      className={`pointer-events-none select-none object-contain [-webkit-user-drag:none] ${SIZE_CLASSES[size]} ${className}`}
    />
  );
}
