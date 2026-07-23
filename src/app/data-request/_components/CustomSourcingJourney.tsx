"use client";

import {
  BadgeCheck,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  MessagesSquare,
  UserSearch,
  type LucideIcon,
} from "lucide-react";
import {
  easeInOut,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

interface Milestone {
  step: number;
  title: string;
  description: string;
  reviewFocus: string;
  outcome: string;
  pathProgress: number;
  nodeOffset: {
    x: number;
    y: number;
  };
  icon: LucideIcon;
}

interface StepWindow {
  arrival: number;
  departure: number;
}

interface JourneyPoint {
  x: number;
  y: number;
  angle: number;
}

interface StageSize {
  width: number;
  height: number;
}

interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

type MilestoneState = "inactive" | "active" | "completed";

const VIEWBOX_WIDTH = 1200;
// Fit the visible road bounds rather than the original SVG's unused vertical
// margins. Uniform scaling still keeps both U-turns perfectly circular.
const SCENE_TOP = 120;
const SCENE_HEIGHT = 840;
const RUN_START_X = 220;
const RUN_END_X = 980;
const TOP_Y = 180;
const MIDDLE_Y = 540;
const BOTTOM_Y = 900;
const TURN_RADIUS = 180;
const RUN_LENGTH = RUN_END_X - RUN_START_X;
const TURN_LENGTH = Math.PI * TURN_RADIUS;
const ROAD_LENGTH = RUN_LENGTH * 3 + TURN_LENGTH * 2;
const CURVE_SAMPLE_COUNT = 700;

const MILESTONES: Milestone[] = [
  {
    step: 1,
    title: "Requirement Discovery",
    pathProgress: 180 / ROAD_LENGTH,
    nodeOffset: { x: -10, y: 28 },
    icon: ClipboardList,
    description:
      "Align the use case, specifications, volume, timeline, compliance needs, and budget.",
    reviewFocus: "Use case · scope · compliance · budget",
    outcome: "A sourcing brief approved for supplier matching",
  },
  {
    step: 2,
    title: "Supplier Identification",
    pathProgress: 540 / ROAD_LENGTH,
    nodeOffset: { x: 12, y: 24 },
    icon: UserSearch,
    description:
      "Match the brief with verified suppliers and request samples, pricing, and delivery terms.",
    reviewFocus: "Supplier fit · availability · pricing · timelines",
    outcome: "A qualified shortlist with comparable options",
  },
  {
    step: 3,
    title: "Samples & Feasibility",
    pathProgress: (RUN_LENGTH + TURN_LENGTH + 180) / ROAD_LENGTH,
    nodeOffset: { x: 16, y: -30 },
    icon: FlaskConical,
    description:
      "Evaluate samples for relevance, quality, format, availability, pricing, and feasibility.",
    reviewFocus: "Relevance · quality · format · licensing",
    outcome: "Reviewed samples and a feasibility assessment",
  },
  {
    step: 4,
    title: "Client Review",
    pathProgress: (RUN_LENGTH + TURN_LENGTH + 540) / ROAD_LENGTH,
    nodeOffset: { x: -18, y: 26 },
    icon: MessagesSquare,
    description:
      "Share the strongest options, gather feedback, and resolve remaining technical gaps.",
    reviewFocus: "Sample comparison · feedback · refinements",
    outcome: "An approved sample and finalized requirement",
  },
  {
    step: 5,
    title: "Supplier Finalization",
    pathProgress: (RUN_LENGTH * 2 + TURN_LENGTH * 2 + 180) / ROAD_LENGTH,
    nodeOffset: { x: -8, y: -26 },
    icon: BadgeCheck,
    description:
      "Confirm the supplier, scope, volumes, commercial terms, and delivery plan.",
    reviewFocus: "Volumes · commercials · delivery schedule",
    outcome: "A selected supplier with agreed working terms",
  },
  {
    step: 6,
    title: "Contracting & Execution",
    pathProgress: (RUN_LENGTH * 2 + TURN_LENGTH * 2 + 540) / ROAD_LENGTH,
    nodeOffset: { x: 18, y: -30 },
    icon: FileCheck2,
    description:
      "Finalize agreements, oversee sourcing and validation, and complete the final handover.",
    reviewFocus: "Contracts · usage rights · QA · delivery tracking",
    outcome: "Validated data, documentation, and final handover",
  },
];

const STEP_WINDOWS: StepWindow[] = [
  { arrival: 0.08, departure: 0.18 },
  { arrival: 0.23, departure: 0.33 },
  { arrival: 0.38, departure: 0.48 },
  { arrival: 0.53, departure: 0.63 },
  { arrival: 0.68, departure: 0.78 },
  { arrival: 0.83, departure: 0.93 },
];
const ROAD_SCROLL_STOPS = [
  0,
  ...STEP_WINDOWS.flatMap((window) => [window.arrival, window.departure]),
  1,
];
const ROAD_PROGRESS_STOPS = [
  0,
  ...MILESTONES.flatMap((milestone) => [
    milestone.pathProgress,
    milestone.pathProgress,
  ]),
  1,
];
const PHONE_NODE_PROGRESS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const PHONE_PROGRESS_STOPS = [
  0,
  ...PHONE_NODE_PROGRESS.flatMap((progress) => [progress, progress]),
  1,
];
const MILESTONE_TRIGGER_LEAD = 0.004;

function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

function roadProgressAtScroll(rawProgress: number) {
  return progressAtScroll(rawProgress, ROAD_PROGRESS_STOPS);
}

function phoneProgressAtScroll(rawProgress: number) {
  return progressAtScroll(rawProgress, PHONE_PROGRESS_STOPS);
}

function progressAtScroll(rawProgress: number, outputStops: number[]) {
  const progress = clampProgress(rawProgress);

  for (let index = 0; index < ROAD_SCROLL_STOPS.length - 1; index += 1) {
    const start = ROAD_SCROLL_STOPS[index];
    const end = ROAD_SCROLL_STOPS[index + 1];
    if (progress > end) continue;

    const segmentProgress =
      end === start ? 1 : (progress - start) / (end - start);
    const easedProgress = easeInOut(clampProgress(segmentProgress));
    const outputStart = outputStops[index];
    const outputEnd = outputStops[index + 1];
    return outputStart + (outputEnd - outputStart) * easedProgress;
  }

  return 1;
}

function cameraStrengthAtScroll(rawProgress: number) {
  const progress = clampProgress(rawProgress);
  const firstArrival = STEP_WINDOWS[0].arrival;
  const finalDeparture = STEP_WINDOWS[STEP_WINDOWS.length - 1].departure;

  if (progress < firstArrival) {
    return easeInOut(progress / firstArrival);
  }
  if (progress <= finalDeparture) return 1;
  return 1 - easeInOut((progress - finalDeparture) / (1 - finalDeparture));
}

function overviewContentOpacityAtScroll(value: number) {
  if (value > STEP_WINDOWS[STEP_WINDOWS.length - 1].departure) {
    return easeInOut(clampProgress((value - 0.975) / 0.025));
  }

  const strength = cameraStrengthAtScroll(value);
  const fadeProgress = clampProgress((strength - 0.12) / 0.68);
  return 1 - easeInOut(fadeProgress);
}

function cameraStateAtScroll(
  rawProgress: number,
  stageSize: StageSize,
  isCompact: boolean
): CameraState {
  const progress = clampProgress(rawProgress);
  const strength = cameraStrengthAtScroll(progress);
  const targetZoom = isCompact ? 1.55 : 1.82;
  const zoom = 1 + (targetZoom - 1) * strength;
  const routeProgress = roadProgressAtScroll(progress);
  const routePoint = sampleStageRoad(routeProgress, stageSize);
  const focusX = stageSize.width * (isCompact ? 0.5 : 0.31);
  const focusY = stageSize.height * (isCompact ? 0.48 : 0.5);
  const targetX = focusX - routePoint.x * zoom;
  const targetY = focusY - routePoint.y * zoom;

  return {
    x: targetX * strength,
    y: targetY * strength,
    zoom,
  };
}

function projectPointThroughCamera(
  point: JourneyPoint,
  camera: CameraState
): JourneyPoint {
  return {
    x: camera.x + point.x * camera.zoom,
    y: camera.y + point.y * camera.zoom,
    angle: point.angle,
  };
}

/**
 * Samples the route by traveled distance, so straight runs and semicircular
 * turns share one uniform clock. This is the single source of truth for the
 * Canvas line, traveling marker, milestone nodes, and activation timing.
 */
function sampleLogicalRoad(rawProgress: number): JourneyPoint {
  let distance = clampProgress(rawProgress) * ROAD_LENGTH;

  if (distance <= RUN_LENGTH) {
    return { x: RUN_START_X + distance, y: TOP_Y, angle: 0 };
  }

  distance -= RUN_LENGTH;
  if (distance <= TURN_LENGTH) {
    const angle = distance / TURN_RADIUS;
    return {
      x: RUN_END_X + TURN_RADIUS * Math.sin(angle),
      y: (TOP_Y + MIDDLE_Y) / 2 - TURN_RADIUS * Math.cos(angle),
      angle,
    };
  }

  distance -= TURN_LENGTH;
  if (distance <= RUN_LENGTH) {
    return { x: RUN_END_X - distance, y: MIDDLE_Y, angle: Math.PI };
  }

  distance -= RUN_LENGTH;
  if (distance <= TURN_LENGTH) {
    const turnAngle = distance / TURN_RADIUS;
    return {
      x: RUN_START_X - TURN_RADIUS * Math.sin(turnAngle),
      y: (MIDDLE_Y + BOTTOM_Y) / 2 - TURN_RADIUS * Math.cos(turnAngle),
      angle: Math.PI - turnAngle,
    };
  }

  distance -= TURN_LENGTH;
  return {
    x: RUN_START_X + Math.min(distance, RUN_LENGTH),
    y: BOTTOM_Y,
    angle: 0,
  };
}

function mapRoadPointToStage(
  point: JourneyPoint,
  stageSize: StageSize
): JourneyPoint {
  const scale = Math.min(
    stageSize.width / VIEWBOX_WIDTH,
    stageSize.height / SCENE_HEIGHT
  );
  const offsetX = (stageSize.width - VIEWBOX_WIDTH * scale) / 2;
  const verticalLift = stageSize.width < 768 ? 8 : 14;
  const offsetY =
    (stageSize.height - SCENE_HEIGHT * scale) / 2 -
    SCENE_TOP * scale -
    verticalLift;

  return {
    x: offsetX + point.x * scale,
    y: offsetY + point.y * scale,
    angle: point.angle,
  };
}

function sampleStageRoad(progress: number, stageSize: StageSize) {
  return mapRoadPointToStage(sampleLogicalRoad(progress), stageSize);
}

function buildCurveSamples(stageSize: StageSize) {
  return Array.from({ length: CURVE_SAMPLE_COUNT }, (_, index) =>
    sampleStageRoad(index / (CURVE_SAMPLE_COUNT - 1), stageSize)
  );
}

function sampleCurveAtProgress(samples: JourneyPoint[], rawProgress: number) {
  const scaledProgress = clampProgress(rawProgress) * (samples.length - 1);
  const lowerIndex = Math.floor(scaledProgress);
  const upperIndex = Math.min(samples.length - 1, lowerIndex + 1);
  const interpolation = scaledProgress - lowerIndex;
  const lower = samples[lowerIndex];
  const upper = samples[upperIndex];

  return {
    point: {
      x: lower.x + (upper.x - lower.x) * interpolation,
      y: lower.y + (upper.y - lower.y) * interpolation,
      angle: lower.angle + (upper.angle - lower.angle) * interpolation,
    },
    lowerIndex,
  };
}

function milestoneStateAt(
  milestoneIndex: number,
  progress: number
): MilestoneState {
  const milestone = MILESTONES[milestoneIndex];
  const next = MILESTONES[milestoneIndex + 1];
  const activationStart = Math.max(
    0,
    milestone.pathProgress - MILESTONE_TRIGGER_LEAD
  );
  const activationEnd = next
    ? next.pathProgress - MILESTONE_TRIGGER_LEAD
    : 0.995;

  if (progress < activationStart) return "inactive";
  if (progress < activationEnd) return "active";
  return "completed";
}

export function CustomSourcingJourney() {
  const prefersReducedMotion = useReducedMotion();

  return prefersReducedMotion ? <StaticJourney /> : <ScrollDrivenJourney />;
}

function JourneyHeading() {
  return (
    <header className="relative z-20 mx-auto w-full max-w-7xl shrink-0 px-5 pt-20 pb-5 text-center sm:px-8 sm:pt-18 sm:pb-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/55 dark:text-white/50 sm:text-xs">
        Managed sourcing workflow
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
        How Kuinbee&apos;s Custom Data Sourcing Works
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        One managed journey from requirement discovery and verified supplier
        evaluation through contracting, quality assurance, and final delivery.
      </p>
    </header>
  );
}

function ScrollDrivenJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const roadProgress = useTransform(scrollYProgress, roadProgressAtScroll);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-label="Custom data sourcing workflow"
      className="relative z-10 h-[320svh] text-foreground lg:h-[300svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <JourneyViewport
          scrollProgress={scrollYProgress}
          roadProgress={roadProgress}
        />
      </div>
    </section>
  );
}

interface JourneyViewportProps {
  scrollProgress: MotionValue<number>;
  roadProgress: MotionValue<number>;
}

function JourneyViewport({
  scrollProgress,
  roadProgress,
}: JourneyViewportProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState<StageSize>({
    width: 0,
    height: 0,
  });
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateSize = () => {
      const bounds = stage.getBoundingClientRect();
      const nextSize = { width: bounds.width, height: bounds.height };
      setStageSize((current) =>
        current.width === nextSize.width && current.height === nextSize.height
          ? current
          : nextSize
      );
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(stage);
    updateSize();
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateLayout = () => setIsCompact(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <JourneyHeading />

      <div className="relative min-h-0 flex-1">
        <PhoneStraightJourney
          scrollProgress={scrollProgress}
          roadProgress={roadProgress}
        />

        <div
          ref={stageRef}
          className="absolute inset-x-0 top-0 bottom-64 mx-auto hidden max-w-7xl overflow-hidden sm:block lg:inset-0 lg:px-6 xl:px-8"
        >
          <JourneyCamera
            stageSize={stageSize}
            scrollProgress={scrollProgress}
            isCompact={isCompact}
          >
            <JourneyPath
              stageRef={stageRef}
              stageSize={stageSize}
              progress={roadProgress}
            />
          </JourneyCamera>

          {stageSize.width > 0 && (
            <>
              <JourneyEndpointLights
                stageSize={stageSize}
                scrollProgress={scrollProgress}
                roadProgress={roadProgress}
                isCompact={isCompact}
              />
              {MILESTONES.map((milestone, index) => (
                <JourneyNode
                  key={milestone.step}
                  milestone={milestone}
                  milestoneIndex={index}
                  stageSize={stageSize}
                  scrollProgress={scrollProgress}
                  progress={roadProgress}
                  isCompact={isCompact}
                />
              ))}
            </>
          )}
        </div>

        <CompactJourneyOverview scrollProgress={scrollProgress} />
        <FocusedMilestoneReadout scrollProgress={scrollProgress} />

        <ol className="sr-only">
          {MILESTONES.map((milestone) => (
            <li key={milestone.step}>
              Step {milestone.step}: {milestone.title}. {milestone.description}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

interface PhoneStraightJourneyProps {
  scrollProgress: MotionValue<number>;
  roadProgress: MotionValue<number>;
}

function PhoneStraightJourney({
  scrollProgress,
  roadProgress,
}: PhoneStraightJourneyProps) {
  const lineProgress = useTransform(scrollProgress, phoneProgressAtScroll);
  const beamTop = useTransform(lineProgress, [0, 1], ["5%", "95%"]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 bottom-64 sm:hidden"
    >
      <div className="absolute top-[5%] bottom-[5%] left-1/2 w-px -translate-x-1/2 bg-secondary/35" />
      <motion.div
        style={{ scaleY: lineProgress }}
        className="absolute top-[5%] left-1/2 h-[90%] w-[2px] -translate-x-1/2 origin-top bg-primary"
      />

      <motion.div
        style={{ top: beamTop }}
        className="absolute left-1/2 z-[5] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow-[0_0_18px_rgba(148,163,184,0.65)]"
      />

      {MILESTONES.map((milestone, index) => (
        <PhoneJourneyNode
          key={milestone.step}
          milestone={milestone}
          milestoneIndex={index}
          top={`calc(5% + ${PHONE_NODE_PROGRESS[index] * 90}%)`}
          progress={roadProgress}
        />
      ))}

      <span className="absolute top-[4%] left-[calc(50%+1.75rem)] font-mono text-[8px] font-semibold tracking-[0.14em] text-muted-foreground">
        START
      </span>
      <span className="absolute bottom-[3%] left-[calc(50%+1.75rem)] font-mono text-[8px] font-semibold tracking-[0.14em] text-muted-foreground">
        HANDOVER
      </span>
    </div>
  );
}

interface PhoneJourneyNodeProps {
  milestone: Milestone;
  milestoneIndex: number;
  top: string;
  progress: MotionValue<number>;
}

function PhoneJourneyNode({
  milestone,
  milestoneIndex,
  top,
  progress,
}: PhoneJourneyNodeProps) {
  const stateMotionValue = useTransform(progress, (currentProgress) =>
    milestoneStateAt(milestoneIndex, currentProgress)
  );
  const [visualState, setVisualState] = useState<MilestoneState>(() =>
    milestoneStateAt(milestoneIndex, progress.get())
  );
  const Icon = milestone.icon;

  useMotionValueEvent(stateMotionValue, "change", setVisualState);

  return (
    <div className="absolute left-1/2 z-10 h-0 w-0" style={{ top }}>
      <motion.div
        animate={
          visualState === "active"
            ? { opacity: 1, scale: 1.08 }
            : visualState === "completed"
              ? { opacity: 0.9, scale: 1 }
              : { opacity: 0.68, scale: 0.94 }
        }
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-card shadow-md ${
          visualState === "active"
            ? "border-primary bg-primary text-primary-foreground ring-4 ring-primary/10"
            : visualState === "completed"
              ? "border-primary/55 text-primary"
              : "border-secondary/55 text-secondary"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </motion.div>
    </div>
  );
}

interface JourneyCameraProps {
  stageSize: StageSize;
  scrollProgress: MotionValue<number>;
  isCompact: boolean;
  children: ReactNode;
}

function JourneyCamera({
  stageSize,
  scrollProgress,
  isCompact,
  children,
}: JourneyCameraProps) {
  const cameraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stageSize.width === 0 || stageSize.height === 0) return;

    let latestProgress = scrollProgress.get();
    let animationFrame = 0;

    const draw = () => {
      animationFrame = 0;
      const camera = cameraStateAtScroll(latestProgress, stageSize, isCompact);

      cameraRef.current?.style.setProperty(
        "transform",
        `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.zoom})`
      );
    };

    const scheduleDraw = (nextProgress: number) => {
      latestProgress = clampProgress(nextProgress);
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(draw);
    };

    scheduleDraw(scrollProgress.get());
    const unsubscribe = scrollProgress.on("change", scheduleDraw);

    return () => {
      unsubscribe();
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
    };
  }, [isCompact, scrollProgress, stageSize]);

  return (
    <div
      ref={cameraRef}
      className="absolute inset-0 origin-top-left will-change-transform"
    >
      {children}
    </div>
  );
}

interface JourneyPathProps {
  stageRef: RefObject<HTMLDivElement | null>;
  stageSize: StageSize;
  progress: MotionValue<number>;
}

function JourneyPath({ stageRef, stageSize, progress }: JourneyPathProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamGroupRef = useRef<HTMLDivElement>(null);
  const beamDirectionRef = useRef<HTMLDivElement>(null);
  const beamOpacity = useTransform(
    progress,
    [0, 0.012, 0.985, 1],
    [0, 1, 1, 0]
  );

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas || stageSize.width === 0 || stageSize.height === 0) {
      return;
    }

    // The canvas itself is zoomed by the camera. Render above native DPR so
    // the road remains sharp at the maximum focused zoom.
    const pixelRatio = Math.min((window.devicePixelRatio || 1) * 1.85, 3);
    canvas.width = Math.max(1, Math.round(stageSize.width * pixelRatio));
    canvas.height = Math.max(1, Math.round(stageSize.height * pixelRatio));
    canvas.style.width = stageSize.width + "px";
    canvas.style.height = stageSize.height + "px";

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const samples = buildCurveSamples(stageSize);
    let baseColor = "#4e5a7e";
    let activeColor = "#1a2240";
    let latestProgress = progress.get();
    let animationFrame = 0;

    const readThemeColors = () => {
      const styles = getComputedStyle(stage);
      baseColor = styles.getPropertyValue("--secondary").trim() || baseColor;
      activeColor = styles.getPropertyValue("--primary").trim() || activeColor;
    };

    const draw = () => {
      animationFrame = 0;
      const { point: endpoint, lowerIndex } = sampleCurveAtProgress(
        samples,
        latestProgress
      );

      context.clearRect(0, 0, stageSize.width, stageSize.height);
      context.lineCap = "round";
      context.lineJoin = "round";

      context.beginPath();
      context.moveTo(samples[0].x, samples[0].y);
      for (let index = 1; index < samples.length; index += 1) {
        context.lineTo(samples[index].x, samples[index].y);
      }
      context.strokeStyle = baseColor;
      context.globalAlpha = 0.3;
      context.lineWidth = 1.7;
      context.stroke();

      context.beginPath();
      context.moveTo(samples[0].x, samples[0].y);
      for (let index = 1; index <= lowerIndex; index += 1) {
        context.lineTo(samples[index].x, samples[index].y);
      }
      context.lineTo(endpoint.x, endpoint.y);
      context.strokeStyle = activeColor;
      context.globalAlpha = 1;
      context.lineWidth = 2.25;
      context.stroke();

      beamGroupRef.current?.style.setProperty(
        "transform",
        `translate3d(${endpoint.x}px, ${endpoint.y}px, 0)`
      );
      beamDirectionRef.current?.style.setProperty(
        "transform",
        `rotate(${endpoint.angle}rad)`
      );
    };

    const scheduleDraw = (nextProgress: number) => {
      latestProgress = clampProgress(nextProgress);
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(draw);
    };

    readThemeColors();
    scheduleDraw(progress.get());
    const unsubscribe = progress.on("change", scheduleDraw);
    const themeObserver = new MutationObserver(() => {
      readThemeColors();
      scheduleDraw(progress.get());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      unsubscribe();
      themeObserver.disconnect();
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
    };
  }, [progress, stageRef, stageSize]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <motion.div
        ref={beamGroupRef}
        style={{ opacity: beamOpacity }}
        className="absolute top-0 left-0 z-30 h-0 w-0 will-change-transform"
      >
        <div
          ref={beamDirectionRef}
          className="absolute top-0 left-0 h-0 w-0 will-change-transform"
        >
          <span className="absolute top-[-0.5px] right-1 h-px w-3 bg-primary/35" />
          <span className="absolute top-0 left-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary" />
        </div>
      </motion.div>
    </div>
  );
}

interface JourneyNodeProps {
  milestone: Milestone;
  milestoneIndex: number;
  stageSize: StageSize;
  scrollProgress: MotionValue<number>;
  progress: MotionValue<number>;
  isCompact: boolean;
}

function JourneyNode({
  milestone,
  milestoneIndex,
  stageSize,
  scrollProgress,
  progress,
  isCompact,
}: JourneyNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const stateMotionValue = useTransform(progress, (currentProgress) =>
    milestoneStateAt(milestoneIndex, currentProgress)
  );
  const [visualState, setVisualState] = useState<MilestoneState>(() =>
    milestoneStateAt(milestoneIndex, progress.get())
  );
  const Icon = milestone.icon;
  const offsetScale = isCompact ? 0.82 : 1;
  const offsetX = milestone.nodeOffset.x * offsetScale;
  const offsetY = milestone.nodeOffset.y * offsetScale;
  const connectorLength = Math.hypot(offsetX, offsetY);
  const connectorAngle = Math.atan2(-offsetY, -offsetX);
  const overviewLabelOpacity = useTransform(
    scrollProgress,
    overviewContentOpacityAtScroll
  );

  useMotionValueEvent(stateMotionValue, "change", setVisualState);

  useEffect(() => {
    let latestProgress = scrollProgress.get();
    let animationFrame = 0;
    const anchor = sampleStageRoad(milestone.pathProgress, stageSize);

    const draw = () => {
      animationFrame = 0;
      const camera = cameraStateAtScroll(latestProgress, stageSize, isCompact);
      const projectedAnchor = projectPointThroughCamera(anchor, camera);

      nodeRef.current?.style.setProperty(
        "transform",
        `translate3d(${projectedAnchor.x + offsetX}px, ${projectedAnchor.y + offsetY}px, 0)`
      );
    };

    const scheduleDraw = (nextProgress: number) => {
      latestProgress = clampProgress(nextProgress);
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(draw);
    };

    scheduleDraw(scrollProgress.get());
    const unsubscribe = scrollProgress.on("change", scheduleDraw);

    return () => {
      unsubscribe();
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
    };
  }, [
    isCompact,
    milestone.pathProgress,
    offsetX,
    offsetY,
    scrollProgress,
    stageSize,
  ]);

  const nodeAnimation =
    visualState === "inactive"
      ? { opacity: 0.68, scale: 0.94 }
      : visualState === "active"
        ? { opacity: 1, scale: 1.06 }
        : { opacity: 0.84, scale: 1 };

  return (
    <div
      ref={nodeRef}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-20 h-0 w-0 will-change-transform"
    >
      <motion.span
        animate={{ opacity: visualState === "active" ? 0.9 : 0.42 }}
        transition={{ duration: 0.2 }}
        className="absolute top-[-0.5px] left-0 h-px origin-left bg-primary"
        style={{
          width: connectorLength,
          transform: `rotate(${connectorAngle}rad)`,
        }}
      />
      <motion.span
        animate={{ opacity: visualState === "active" ? 1 : 0.55 }}
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background bg-primary"
        style={{ left: -offsetX, top: -offsetY }}
      />
      <motion.div
        animate={nodeAnimation}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className={`absolute top-0 left-0 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-colors duration-200 sm:h-11 sm:w-11 dark:shadow-[0_8px_24px_rgba(0,0,0,0.32)] ${
          visualState === "active"
            ? "border-primary bg-primary text-primary-foreground ring-[6px] ring-primary/10"
            : visualState === "completed"
              ? "border-primary/55 bg-background text-primary"
              : "border-secondary/55 bg-background text-secondary"
        }`}
      >
        <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={1.8} />
      </motion.div>

      <motion.div
        style={{ opacity: overviewLabelOpacity }}
        className={`absolute left-1/2 hidden w-52 -translate-x-1/2 text-center lg:block ${
          offsetY > 0 ? "top-8" : "bottom-8"
        }`}
      >
        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-primary/45 dark:text-white/40">
          Step {String(milestone.step).padStart(2, "0")}
        </p>
        <p className="mt-1 text-xs font-medium leading-4 text-foreground/80 dark:text-white/75">
          {milestone.title}
        </p>
      </motion.div>
    </div>
  );
}

interface JourneyEndpointLightsProps {
  stageSize: StageSize;
  scrollProgress: MotionValue<number>;
  roadProgress: MotionValue<number>;
  isCompact: boolean;
}

function JourneyEndpointLights({
  stageSize,
  scrollProgress,
  roadProgress,
  isCompact,
}: JourneyEndpointLightsProps) {
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const endGlow = useTransform(roadProgress, [0, 0.86, 1], [0.45, 0.45, 1]);
  const endScale = useTransform(roadProgress, [0, 0.92, 1], [0.86, 0.86, 1]);

  useEffect(() => {
    let latestProgress = scrollProgress.get();
    let animationFrame = 0;
    const startPoint = sampleStageRoad(0, stageSize);
    const endPoint = sampleStageRoad(1, stageSize);

    const draw = () => {
      animationFrame = 0;
      const camera = cameraStateAtScroll(latestProgress, stageSize, isCompact);
      const start = projectPointThroughCamera(startPoint, camera);
      const end = projectPointThroughCamera(endPoint, camera);

      startRef.current?.style.setProperty(
        "transform",
        `translate3d(${start.x}px, ${start.y}px, 0)`
      );
      endRef.current?.style.setProperty(
        "transform",
        `translate3d(${end.x}px, ${end.y}px, 0)`
      );
    };

    const scheduleDraw = (nextProgress: number) => {
      latestProgress = clampProgress(nextProgress);
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(draw);
    };

    scheduleDraw(scrollProgress.get());
    const unsubscribe = scrollProgress.on("change", scheduleDraw);

    return () => {
      unsubscribe();
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
    };
  }, [isCompact, scrollProgress, stageSize]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
    >
      <div
        ref={startRef}
        className="absolute top-0 left-0 h-0 w-0 will-change-transform"
      >
        <span className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-xl" />
        <span className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/35 bg-background shadow-[0_0_18px_rgba(148,163,184,0.45)]" />
        <span className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        <span className="absolute top-4 left-0 -translate-x-1/2 font-mono text-[8px] font-semibold tracking-[0.16em] text-muted-foreground">
          START
        </span>
      </div>

      <div
        ref={endRef}
        className="absolute top-0 left-0 h-0 w-0 will-change-transform"
      >
        <motion.div style={{ opacity: endGlow, scale: endScale }}>
          <span className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-xl" />
          <span className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-background shadow-[0_0_22px_rgba(148,163,184,0.55)]" />
          <span className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
          <span className="absolute bottom-5 left-0 -translate-x-1/2 font-mono text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-muted-foreground">
            HANDOVER
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function CompactJourneyOverview({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollProgress, overviewContentOpacityAtScroll);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-4 bottom-4 z-30 h-56 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg lg:hidden"
    >
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-primary/55 dark:text-white/45">
          Journey overview
        </p>
        <p className="text-[9px] text-muted-foreground">Scroll to explore</p>
      </div>

      <ol className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/60 pt-3">
        {MILESTONES.map((milestone) => (
          <li key={milestone.step} className="flex min-w-0 items-start gap-2">
            <span className="shrink-0 font-mono text-[8px] font-semibold tracking-[0.12em] text-primary/45">
              {String(milestone.step).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-medium leading-4 text-foreground/78 dark:text-white/72">
              {milestone.title}
            </span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

function FocusedMilestoneReadout({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-4 z-40 mx-auto h-56 max-w-7xl px-4 lg:top-1/2 lg:bottom-auto lg:h-[22rem] lg:-translate-y-1/2 lg:px-6 xl:px-8"
    >
      <div className="relative h-full lg:ml-auto lg:w-[26rem]">
        {MILESTONES.map((milestone, index) => (
          <FocusedMilestoneReadoutItem
            key={milestone.step}
            milestone={milestone}
            stepWindow={STEP_WINDOWS[index]}
            scrollProgress={scrollProgress}
          />
        ))}
      </div>
    </div>
  );
}

interface FocusedMilestoneReadoutItemProps {
  milestone: Milestone;
  stepWindow: StepWindow;
  scrollProgress: MotionValue<number>;
}

function FocusedMilestoneReadoutItem({
  milestone,
  stepWindow,
  scrollProgress,
}: FocusedMilestoneReadoutItemProps) {
  const fadeInStart = stepWindow.arrival - 0.025;
  const fullyVisible = stepWindow.arrival + 0.015;
  const fadeOutStart = stepWindow.departure - 0.02;
  const fadeOutEnd = stepWindow.departure + 0.025;
  const inputRange = [fadeInStart, fullyVisible, fadeOutStart, fadeOutEnd];
  const opacity = useTransform(scrollProgress, inputRange, [0, 1, 1, 0], {
    clamp: true,
    ease: [easeInOut, easeInOut, easeInOut],
  });
  const y = useTransform(scrollProgress, inputRange, [12, 0, 0, -8], {
    clamp: true,
    ease: [easeInOut, easeInOut, easeInOut],
  });
  const scale = useTransform(scrollProgress, inputRange, [0.985, 1, 1, 0.99], {
    clamp: true,
    ease: [easeInOut, easeInOut, easeInOut],
  });
  const Icon = milestone.icon;

  return (
    <motion.article
      style={{ opacity, y, scale }}
      className="absolute inset-0 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg lg:p-6"
    >
      <div className="relative z-10 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary lg:h-12 lg:w-12">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/60">
            Step {String(milestone.step).padStart(2, "0")}
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-card-foreground lg:text-2xl">
            {milestone.title}
          </h3>
        </div>
      </div>

      <p className="relative z-10 mt-3 max-w-md text-[11px] leading-4 text-muted-foreground lg:mt-5 lg:text-sm lg:leading-6">
        {milestone.description}
      </p>

      <dl className="relative z-10 mt-3 grid grid-cols-2 gap-x-4 border-t border-border/80 pt-3 lg:mt-5 lg:gap-x-6 lg:pt-4">
        <div>
          <dt className="text-[9px] font-semibold uppercase tracking-[0.14em] text-primary/55 lg:text-[10px]">
            We review
          </dt>
          <dd className="mt-1 text-[10px] leading-4 text-muted-foreground lg:text-xs lg:leading-5">
            {milestone.reviewFocus}
          </dd>
        </div>
        <div>
          <dt className="text-[9px] font-semibold uppercase tracking-[0.14em] text-primary/55 lg:text-[10px]">
            Outcome
          </dt>
          <dd className="mt-1 text-[10px] leading-4 text-muted-foreground lg:text-xs lg:leading-5">
            {milestone.outcome}
          </dd>
        </div>
      </dl>
    </motion.article>
  );
}

function StaticJourney() {
  return (
    <section
      id="how-it-works"
      aria-label="Custom data sourcing workflow"
      className="relative z-10 py-20 text-foreground sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/55 dark:text-white/50 sm:text-xs">
            Managed sourcing workflow
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            How Kuinbee&apos;s Custom Data Sourcing Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            One managed journey from requirement discovery and verified supplier
            evaluation through contracting, quality assurance, and final
            delivery.
          </p>
        </div>

        <ol className="mt-12 grid gap-x-8 sm:grid-cols-2">
          {MILESTONES.map((milestone) => {
            const Icon = milestone.icon;
            return (
              <li
                key={milestone.step}
                className="border-t border-border py-6 text-foreground"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-primary/55">
                      STEP {String(milestone.step).padStart(2, "0")}
                    </p>
                    <h3 className="text-sm font-semibold text-foreground">
                      {milestone.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {milestone.description}
                </p>
                <dl className="mt-4 border-t border-border/80 pt-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/55">
                    Outcome
                  </dt>
                  <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                    {milestone.outcome}
                  </dd>
                </dl>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
