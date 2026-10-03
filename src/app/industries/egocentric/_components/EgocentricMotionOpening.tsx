import { IndustryMotionOpening } from "@/app/industries/_components/IndustryMotionOpening";

/** Original egocentric film, using the shared industry-opening behavior. */
export function EgocentricMotionOpening() {
  return (
    <IndustryMotionOpening
      industry="egocentric"
      title="See the task unfold."
      description="First-person video, actions, and context. Find data that matches the way your model needs to see the world."
      datasetHref="/datasets?q=egocentric"
      datasetLabel="Explore egocentric data"
      storyId="egocentric-story"
      film={{
        src: "/images/industries/egocentric/egocentric-hero-film-v1.mp4",
        poster:
          "/images/industries/egocentric/egocentric-hero-film-v1-poster.webp",
        mobileSrc:
          "/images/industries/egocentric/egocentric-hero-film-mobile-v1.mp4",
        mobilePoster:
          "/images/industries/egocentric/egocentric-hero-film-mobile-v1-poster.webp",
        description:
          "Original three-scene sketch sequence: packing a parcel, preparing vegetables, and maintaining a bicycle. Illustrative, not a dataset sample. Each first-person view keeps hands, objects and the real-world setting together.",
      }}
    />
  );
}
