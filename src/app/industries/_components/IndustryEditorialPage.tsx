import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { Link } from "@/components/router/Link";
import { IndustryAccordion } from "./IndustryAccordion";
import { IndustryMotion, IndustryReveal } from "./IndustryMotion";
import { IndustrySketchArtwork } from "./IndustrySketchArtwork";
import {
  IndustryActionBar,
  IndustryArtwork,
  IndustryKicker,
  IndustryPageFrame,
  type IndustryRoute,
  type IndustryScene,
} from "./IndustryPagePrimitives";

export interface IndustryEditorialPageProps {
  industry: "egocentric" | "healthcare" | "voice";
  name: string;
  sceneHeading: string;
  sceneDescription: string;
  scenes: readonly IndustryScene[];
  questions: readonly { title: string; answer: string }[];
  routes: readonly IndustryRoute[];
  sourcingTitle: string;
  sourcingContext: string;
  note?: string;
  opening: ReactNode;
  story?: ReactNode;
  buyerBrief: ReactNode;
}

function SceneStudy({
  industry,
  scene,
  index,
  wide = false,
}: {
  industry: IndustryEditorialPageProps["industry"];
  scene: IndustryScene;
  index: number;
  wide?: boolean;
}) {
  const imageProps = {
    alt: scene.alt,
    imageClassName:
      "contrast-[1.08] transition-transform duration-500 group-hover/study:scale-[1.025] group-focus-within/study:scale-[1.025] dark:contrast-100 motion-reduce:transform-none",
    sizes: wide
      ? "(min-width: 1280px) 724px, (min-width: 768px) 58vw, calc(100vw - 40px)"
      : "(min-width: 1280px) 502px, (min-width: 768px) 42vw, calc(100vw - 40px)",
    className:
      "aspect-[3/2] rounded-[1.5rem] bg-background ring-1 ring-primary/8 transition-shadow duration-300 group-hover/study:shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] dark:ring-white/10",
  };
  return (
    <article className="group/study">
      <figure>
        {industry === "egocentric" ? (
          <IndustryArtwork
            srcLight={scene.lightImage ?? scene.image}
            srcDark={scene.image}
            {...imageProps}
          />
        ) : (
          <IndustrySketchArtwork
            src={scene.lightImage ?? scene.image}
            {...imageProps}
          />
        )}
        <figcaption className="mt-4 flex items-start justify-between gap-4 text-xs leading-5 text-muted-foreground">
          <span>
            0{index} / {scene.label}
          </span>
          <span className="max-w-[70%] text-right">{scene.modelUse}</span>
        </figcaption>
      </figure>
      <div
        aria-hidden="true"
        className="mt-5 h-px w-10 bg-primary/30 transition-[width] duration-500 group-hover/study:w-20 group-focus-within/study:w-20 dark:bg-white/35 motion-reduce:transition-none"
      />
      <h3 className="mt-4 max-w-lg text-balance text-[1.65rem] font-semibold leading-[1.18] tracking-[-0.025em] text-primary dark:text-white sm:text-[1.8rem]">
        {scene.title}
      </h3>
      <p className="mt-3 max-w-xl text-[15px] leading-7 text-muted-foreground">
        {scene.description}
      </p>
      <div className="mt-5">
        <IndustryAccordion
          compact
          items={[
            {
              id: "review",
              title: "What to review",
              content: (
                <dl className="space-y-3">
                  {scene.requirements.map((requirement) => (
                    <div
                      key={requirement.label}
                      className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 text-xs leading-5"
                    >
                      <dt className="font-medium text-primary dark:text-white/85">
                        {requirement.label}
                      </dt>
                      <dd>{requirement.value}</dd>
                    </div>
                  ))}
                </dl>
              ),
            },
          ]}
        />
      </div>
      <Link
        href={scene.href}
        className="group/action mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline decoration-primary/25 underline-offset-4 transition-colors duration-300 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background dark:text-white/90 dark:decoration-white/25"
      >
        {scene.linkLabel}
        <ArrowUpRight
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5 group-focus-visible/action:-translate-y-0.5 group-focus-visible/action:translate-x-0.5 motion-reduce:transform-none"
        />
      </Link>
    </article>
  );
}

export function IndustryEditorialPage(props: IndustryEditorialPageProps) {
  const {
    industry,
    name,
    sceneHeading,
    sceneDescription,
    scenes,
    questions,
    sourcingTitle,
    sourcingContext,
    routes,
    note,
    opening,
    story,
    buyerBrief,
  } = props;
  return (
    <IndustryPageFrame allowSticky={Boolean(story)}>
      <IndustryMotion>
        {opening}
        {story}

        <section
          className="px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
          aria-labelledby={industry + "-contexts"}
        >
          <div className="mx-auto max-w-7xl">
            <IndustryReveal className="grid items-end gap-5 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6">
                <IndustryKicker>Data in context</IndustryKicker>
                <h2
                  id={industry + "-contexts"}
                  tabIndex={-1}
                  className="mt-5 scroll-mt-24 max-w-xl text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.035em] text-primary dark:text-white sm:text-[2.5rem]"
                >
                  {sceneHeading}
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-muted-foreground lg:col-span-5 lg:col-start-8">
                {sceneDescription}
              </p>
            </IndustryReveal>
            <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-8 lg:mt-10 lg:gap-14">
              <IndustryReveal className="md:col-span-7">
                {scenes[0] && (
                  <SceneStudy
                    industry={industry}
                    scene={scenes[0]}
                    index={2}
                    wide
                  />
                )}
              </IndustryReveal>
              <IndustryReveal
                className="md:col-span-5 md:pt-14 lg:pt-20"
                delay={0.08}
              >
                {scenes[1] && (
                  <SceneStudy industry={industry} scene={scenes[1]} index={3} />
                )}
              </IndustryReveal>
            </div>
          </div>
        </section>

        {buyerBrief}

        <IndustryReveal>
          <IndustryActionBar
            industry={name.toLowerCase() + " data"}
            title={sourcingTitle}
            context={sourcingContext}
            routes={routes}
          />
        </IndustryReveal>

        <section
          className="px-5 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28"
          aria-labelledby={industry + "-questions"}
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12 lg:gap-16">
            <IndustryReveal className="lg:col-span-4">
              <IndustryKicker>Before you choose</IndustryKicker>
              <h2
                id={industry + "-questions"}
                className="mt-5 text-3xl font-semibold leading-[1.15] tracking-[-0.035em] text-primary dark:text-white"
              >
                A clearer brief.
                <br />A better shortlist.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                Check how the data was collected, what it covers, and whether
                its usage terms fit your project.
              </p>
            </IndustryReveal>
            <IndustryReveal className="lg:col-span-8" delay={0.06}>
              <IndustryAccordion
                items={questions.map((question, index) => ({
                  id: industry + "-question-" + index,
                  title: question.title,
                  content: (
                    <p className="text-sm leading-7">{question.answer}</p>
                  ),
                }))}
              />
            </IndustryReveal>
            {note && (
              <p className="max-w-4xl text-xs leading-6 text-muted-foreground lg:col-span-12">
                {note}
              </p>
            )}
          </div>
        </section>
      </IndustryMotion>
    </IndustryPageFrame>
  );
}
