/**
 * A separate original three-shot hero film. Content changes, framing does not.
 * Each original scene is held 3.2 seconds, followed by a 0.8-second dissolve.
 * No camera zoom, image resizing, scroll choreography or baked-in small type.
 */
export interface EgocentricHeroFilmSceneProps {
  progress: number;
  idPrefix?: string;
  imageHref?: string;
  imageHrefs?: string[];
  className?: string;
  compact?: boolean;
}

const artwork = [
  "/images/industries/egocentric/egocentric-hero-packing-light-v1.webp",
  "/images/industries/egocentric/egocentric-hero-kitchen-light-v1.webp",
  "/images/industries/egocentric/egocentric-hero-repair-light-v1.webp",
];

function ease(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return (1 - Math.cos(t * Math.PI)) / 2;
}

export function EgocentricHeroFilmScene({
  progress,
  idPrefix = "egocentric-hero-film",
  imageHrefs = artwork,
  className,
  compact = false,
}: EgocentricHeroFilmSceneProps) {
  const phase = ((progress % 1) + 1) % 1;
  const time = phase * 12;
  const shot = Math.min(2, Math.floor(time / 4));
  const next = (shot + 1) % 3;
  const dissolve = ease(((time % 4) - 3.2) / 0.8);
  const width = compact ? 600 : 1200;
  const height = compact ? 520 : 720;
  const filterId = `${idPrefix}-graphite`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      data-hero-film
      data-hero-shot={shot}
    >
      <defs>
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width={width} height={height} fill="white" />
      <image
        href={imageHrefs[shot]}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid slice"
        filter={`url(#${filterId})`}
      />
      {dissolve > 0 && (
        <image
          href={imageHrefs[next]}
          width={width}
          height={height}
          opacity={dissolve}
          preserveAspectRatio="xMidYMid slice"
          filter={`url(#${filterId})`}
        />
      )}
    </svg>
  );
}
