/**
 * Original Kuinbee motion study. The same deterministic scene is used for the
 * live scroll experience and the rendered video; nothing is sampled from a
 * reference website. Annotations are illustrative, not dataset claims.
 */
export interface EgocentricMotionSceneProps {
  progress: number;
  idPrefix?: string;
  imageHref?: string;
  className?: string;
  compact?: boolean;
}

const artwork =
  "/images/industries/egocentric/egocentric-task-observation-light-v4.webp";

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function ease(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function between(value: number, start: number, end: number) {
  return ease((value - start) / (end - start));
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function CornerMarks({ width, height }: { width: number; height: number }) {
  const inset = 12;
  const length = 22;
  return (
    <path
      d={`M${inset} ${inset + length}V${inset}H${inset + length} M${width - inset - length} ${inset}H${width - inset}V${inset + length} M${inset} ${height - inset - length}V${height - inset}H${inset + length} M${width - inset - length} ${height - inset}H${width - inset}V${height - inset - length}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.58"
    />
  );
}

/** Keeps midtone modeling positive, while a white video matte becomes black. */
function DarkGraphiteFilter({
  id,
  preserveInk = false,
}: {
  id: string;
  preserveInk?: boolean;
}) {
  const tones = "0.05 0.13 0.21 0.29 0.37 0.45 0.53 0.58 0.60 0.42 0";
  return (
    <filter id={id} colorInterpolationFilters="sRGB">
      {preserveInk && (
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -8 0 8 0 0"
          result="inkMask"
        />
      )}
      <feColorMatrix
        in="SourceGraphic"
        type="saturate"
        values="0"
        result="graphite"
      />
      <feComponentTransfer in="graphite" result="toned">
        <feFuncR type="table" tableValues={tones} />
        <feFuncG type="table" tableValues={tones} />
        <feFuncB type="table" tableValues={tones} />
      </feComponentTransfer>
      {preserveInk && (
        <>
          <feFlood floodColor="#d3dceb" result="ink" />
          <feComposite
            in="ink"
            in2="inkMask"
            operator="in"
            result="readableInk"
          />
          <feMerge>
            <feMergeNode in="toned" />
            <feMergeNode in="readableInk" />
          </feMerge>
        </>
      )}
    </filter>
  );
}

export function EgocentricVideoToneDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute" }}
    >
      <defs>
        <DarkGraphiteFilter id="egocentric-video-dark-tone" preserveInk />
      </defs>
    </svg>
  );
}

export function EgocentricMotionScene({
  progress,
  idPrefix = "egocentric-study",
  imageHref = artwork,
  className,
  compact = false,
}: EgocentricMotionSceneProps) {
  if (compact) {
    return (
      <CompactMotionScene
        progress={progress}
        idPrefix={idPrefix}
        imageHref={imageHref}
        className={className}
      />
    );
  }
  const p = clamp(progress);
  const arrange = between(p, 0.22, 0.65);
  const source = between(p, 0.76, 0.96);
  const satellites = between(p, 0.5, 0.65);
  const annotation = between(p, 0.02, 0.22);
  const tracks = between(p, 0.64, 0.68) * (1 - between(p, 0.69, 0.75));
  const captionReveal = tracks + between(p, 0.94, 0.99);
  const sheet = between(p, 0.94, 0.99);
  const id = (name: string) => `${idPrefix}-${name}`;
  const central = {
    x: mix(mix(160, 444, arrange), 72, source),
    y: mix(mix(48, 94, arrange), 265, source),
    width: mix(mix(880, 312, arrange), 250, source),
  };
  const sides = [
    {
      x: mix(mix(160, 88, arrange), 72, source),
      y: mix(mix(48, 94, arrange), 40, source),
      width: mix(mix(880, 312, arrange), 250, source),
      label: "The viewpoint",
      detail: "Camera position · field of view",
      image: { x: 0, y: 0, width: 900, height: 600 },
    },
    {
      x: mix(mix(160, 800, arrange), 72, source),
      y: mix(mix(48, 94, arrange), 490, source),
      width: mix(mix(880, 312, arrange), 250, source),
      label: "The setting",
      detail: "Tools · objects · conditions",
      image: { x: -80, y: 0, width: 1040, height: 693.33 },
    },
  ];
  const mainHeight = central.width * (2 / 3);
  const scanX = mix(20, 860, annotation);
  const detailZoom = mix(1, 1.55, arrange);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 720"
      fill="none"
      className={className}
      id={id("root")}
      aria-hidden="true"
      focusable="false"
      data-motion-scene
      data-scene-progress={p.toFixed(3)}
      style={{
        color: "var(--motion-ink, #263145)",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <defs>
        <filter id={id("graphite")} colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <DarkGraphiteFilter id={id("dark-tone")} />
        <clipPath id={id("image-clip")}>
          <rect width="900" height="600" rx="8" />
        </clipPath>
        <linearGradient id={id("paper-fade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.03" />
          <stop offset="0.8" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      <style>{`.dark #${id("root")} { --motion-paper: #000; --motion-ink: #d3dceb; } .dark #${id("root")} image { filter: url(#${id("dark-tone")}); }`}</style>

      {/* White is a neutral compositing matte, not the website background. */}
      <rect width="1200" height="720" fill="var(--motion-paper, white)" />

      <g opacity={satellites}>
        {sides.map((frame) => (
          <g key={frame.label} transform={`translate(${frame.x} ${frame.y})`}>
            <svg
              width={frame.width}
              height={(frame.width * 2) / 3}
              viewBox="0 0 900 600"
            >
              <g clipPath={`url(#${id("image-clip")})`}>
                <image
                  href={imageHref}
                  x={frame.image.x}
                  y={frame.image.y}
                  width={frame.image.width}
                  height={frame.image.height}
                  preserveAspectRatio="xMidYMid slice"
                  filter={`url(#${id("graphite")})`}
                />
                <rect
                  width="900"
                  height="600"
                  fill={`url(#${id("paper-fade")})`}
                />
              </g>
              <CornerMarks width={900} height={600} />
            </svg>
            <text
              y={(frame.width * 2) / 3 + 22}
              fontSize="13"
              fontWeight="500"
              fill="currentColor"
              opacity={captionReveal}
            >
              {frame.label}
            </text>
            <text
              y={(frame.width * 2) / 3 + 41}
              fontSize="11"
              fill="currentColor"
              opacity={captionReveal * 0.65}
            >
              {frame.detail}
            </text>
          </g>
        ))}
      </g>

      {/* This image stays present through every layout transformation. */}
      <g transform={`translate(${central.x} ${central.y})`}>
        <svg width={central.width} height={mainHeight} viewBox="0 0 900 600">
          <g clipPath={`url(#${id("image-clip")})`}>
            <image
              href={imageHref}
              x={mix(0, -220, arrange)}
              y={mix(0, -160, arrange)}
              width={900 * detailZoom}
              height={600 * detailZoom}
              preserveAspectRatio="xMidYMid slice"
              filter={`url(#${id("graphite")})`}
            />
            <rect width="900" height="600" fill={`url(#${id("paper-fade")})`} />
            <path
              d="M415 220h145v170H415z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="5 6"
              opacity={annotation * (1 - arrange) * 0.75}
            />
            <path
              d={`M${scanX} 14V586`}
              stroke="white"
              strokeWidth="2"
              opacity={Math.sin(annotation * Math.PI) * (1 - arrange) * 0.75}
            />
          </g>
          <CornerMarks width={900} height={600} />
        </svg>
        <g opacity={captionReveal}>
          <text
            y={mainHeight + 22}
            fontSize="13"
            fontWeight="500"
            fill="currentColor"
          >
            The interaction
          </text>
          <text
            y={mainHeight + 41}
            fontSize="11"
            fill="currentColor"
            opacity="0.65"
          >
            Hands · screwdriver · fixture
          </text>
        </g>
      </g>

      <g opacity={(1 - arrange) * annotation}>
        <path d="M647 340h415v-42" stroke="currentColor" strokeWidth="1" />
        <circle cx="647" cy="340" r="3" fill="currentColor" />
        <text
          x="1065"
          y="280"
          fontSize="11"
          fill="currentColor"
          fontWeight="500"
        >
          HAND–OBJECT
        </text>
        <text x="1065" y="299" fontSize="11" fill="currentColor" opacity="0.65">
          INTERACTION
        </text>
      </g>

      {/* An example temporal structure, deliberately without invented readings. */}
      <g opacity={tracks}>
        <path d="M102 392H1098" stroke="currentColor" opacity="0.18" />
        <path
          d="M102 390v4m498-4v4m498-4v4"
          stroke="currentColor"
          opacity="0.5"
        />
        <text x="102" y="418" fontSize="10" fill="currentColor" opacity="0.65">
          START OF TASK
        </text>
        <text
          x="600"
          y="418"
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          opacity="0.65"
        >
          DURING THE TASK
        </text>
        <text
          x="1098"
          y="418"
          textAnchor="end"
          fontSize="10"
          fill="currentColor"
          opacity="0.65"
        >
          END OF TASK
        </text>
        <text x="100" y="480" fontSize="12" fill="currentColor" opacity="0.75">
          Actions
        </text>
        <path d="M270 478H1060" stroke="currentColor" opacity="0.18" />
        <rect
          x="272"
          y="460"
          width="275"
          height="36"
          rx="4"
          fill="currentColor"
          opacity="0.06"
        />
        <rect
          x="554"
          y="460"
          width="504"
          height="36"
          rx="4"
          fill="currentColor"
          opacity="0.12"
        />
        <text x="290" y="482" fontSize="12" fill="currentColor">
          Steady the fixture
        </text>
        <text x="572" y="482" fontSize="12" fill="currentColor">
          Tighten the screw
        </text>
        <text x="100" y="547" fontSize="12" fill="currentColor" opacity="0.75">
          Context
        </text>
        <path
          d="M272 541h28l8-7 9 14 11-11 13 7 12-6 14 5h32l9-8 12 13 13-7 11 4h27l9-9 8 10 15-2h28l12-7 8 13 15-9 12 4h34l10-10 10 16 14-8 12 3h27l11-7 10 10 14-4h31l10-12 11 17 14-8 10 3h24l12-5 12 8 11-6h38l9-7 12 12 10-4h20"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.4"
        />
        <text x="272" y="578" fontSize="11" fill="currentColor" opacity="0.6">
          Audio or motion, when included and aligned
        </text>
        <path
          d="M600 355V444"
          stroke="currentColor"
          strokeDasharray="3 5"
          opacity="0.35"
        />
      </g>

      {/* One coherent illustrated brief, not a mock of a real Kuinbee listing. */}
      <g opacity={sheet} transform={`translate(${mix(520, 470, source)} 80)`}>
        <path
          d="M0 0h612v557H0z"
          fill="var(--motion-paper, white)"
          stroke="currentColor"
          strokeOpacity="0.16"
        />
        <path d="M0 0h3v557H0" fill="currentColor" opacity="0.18" />
        <text
          x="36"
          y="42"
          fontSize="11"
          letterSpacing="1.8"
          fill="currentColor"
          opacity="0.65"
        >
          FROM EXAMPLE TO REQUIREMENT
        </text>
        <text
          x="36"
          y="89"
          fontSize="28"
          letterSpacing="-0.8"
          fill="currentColor"
          fontWeight="500"
        >
          Define what the data needs to cover.
        </text>
        <path d="M36 117H575" stroke="currentColor" opacity="0.15" />
        {[
          ["Task", "Activities and outcomes to capture"],
          ["Viewpoint", "Camera placement and visibility"],
          ["Coverage", "Participants, settings, and variation"],
          ["Annotations", "Definitions, timing, and formats"],
          ["Usage", "Source, licence, and access terms"],
        ].map(([label, detail], index) => (
          <g key={label} transform={`translate(36 ${156 + index * 66})`}>
            <text fontSize="12" fill="currentColor" opacity="0.6">
              {label}
            </text>
            <text x="136" fontSize="13" fill="currentColor">
              {detail}
            </text>
            <path d="M0 23H539" stroke="currentColor" opacity="0.09" />
          </g>
        ))}
        <text x="36" y="526" fontSize="11" fill="currentColor" opacity="0.65">
          Search a listing · compare collection · submit a requirement
        </text>
      </g>
      <g opacity={source * 0.4} stroke="currentColor" strokeWidth="1">
        <path d="M348 123h46v228h62" />
        <path d="M348 350h108" />
        <path d="M348 573h46V351" />
        <circle cx="456" cy="351" r="3" fill="var(--motion-paper, white)" />
      </g>
    </svg>
  );
}

/** Reframes the same study for a readable, unpinned mobile narrative. */
function CompactMotionScene({
  progress,
  idPrefix = "compact-study",
  imageHref = artwork,
  className,
}: EgocentricMotionSceneProps) {
  const p = clamp(progress);
  const source = between(p, 0.72, 0.98);
  const structure = between(p, 0.3, 0.65) * (1 - source);
  const annotation = between(p, 0.02, 0.22);
  const width = mix(560, 210, source);
  const height = (width * 2) / 3;
  const filterId = `${idPrefix}-compact-graphite`;
  const clipId = `${idPrefix}-compact-clip`;
  const rootId = `${idPrefix}-compact-root`;
  const darkFilterId = `${idPrefix}-compact-dark-tone`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 520"
      fill="none"
      className={className}
      id={rootId}
      aria-hidden="true"
      focusable="false"
      data-motion-scene
      data-scene-progress={p.toFixed(3)}
      style={{
        color: "var(--motion-ink, #263145)",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <defs>
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <DarkGraphiteFilter id={darkFilterId} />
        <clipPath id={clipId}>
          <rect x="20" y="20" width={width} height={height} rx="6" />
        </clipPath>
      </defs>
      <style>{`.dark #${rootId} { --motion-paper: #000; --motion-ink: #d3dceb; } .dark #${rootId} image { filter: url(#${darkFilterId}); }`}</style>
      <rect width="600" height="520" fill="var(--motion-paper, white)" />
      <g clipPath={`url(#${clipId})`}>
        <image
          href={imageHref}
          x="20"
          y="20"
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
          filter={`url(#${filterId})`}
        />
        <path
          d={`M${20 + width * 0.46} ${20 + height * 0.37}h${width * 0.16}v${height * 0.28}h-${width * 0.16}z`}
          stroke="white"
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity={annotation * (1 - source) * 0.8}
        />
        <path
          d={`M${20 + annotation * width} 20v${height}`}
          stroke="white"
          strokeWidth="2"
          opacity={Math.sin(annotation * Math.PI) * (1 - source) * 0.8}
        />
      </g>

      <g opacity={structure}>
        <path
          d="M20 425H580"
          stroke="currentColor"
          opacity="0.22"
          strokeDasharray="560"
          strokeDashoffset={(1 - structure) * 560}
        />
        <path
          d="M20 420v10m280-10v10m280-10v10"
          stroke="currentColor"
          opacity="0.5"
        />
        <rect
          x="20"
          y="445"
          width="236"
          height="48"
          rx="4"
          fill="currentColor"
          opacity="0.07"
        />
        <rect
          x="263"
          y="445"
          width="317"
          height="48"
          rx="4"
          fill="currentColor"
          opacity="0.14"
        />
        <text x="34" y="475" fontSize="22" fill="currentColor">
          Steady the fixture
        </text>
        <text x="278" y="475" fontSize="22" fill="currentColor">
          Tighten the screw
        </text>
      </g>

      <g opacity={source}>
        <text
          x="275"
          y="76"
          fontSize="28"
          fontWeight="500"
          letterSpacing="-0.7"
          fill="currentColor"
        >
          Frame the brief.
        </text>
        <text x="275" y="111" fontSize="20" fill="currentColor" opacity="0.65">
          Task · labels · terms
        </text>
        <path
          d="M20 190H580v310H20z"
          fill="var(--motion-paper, white)"
          stroke="currentColor"
          strokeOpacity="0.18"
        />
        <text x="42" y="232" fontSize="24" fontWeight="500" fill="currentColor">
          What does your project need?
        </text>
        {[
          ["Task", "Activities and outcomes"],
          ["Capture", "Viewpoint and conditions"],
          ["Labels", "Definitions and timing"],
          ["Usage", "Source, licence, and access"],
        ].map(([label, detail], index) => (
          <g key={label} transform={`translate(42 ${280 + index * 57})`}>
            <text fontSize="21" fill="currentColor" opacity="0.65">
              {label}
            </text>
            <text x="132" fontSize="21" fill="currentColor">
              {detail}
            </text>
            <path d="M0 23H514" stroke="currentColor" opacity="0.12" />
          </g>
        ))}
      </g>
    </svg>
  );
}
