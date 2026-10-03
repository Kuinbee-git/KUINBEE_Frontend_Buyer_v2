# Industry pages

Routes: `/industries/egocentric`, `/industries/healthcare`, and `/industries/voice`.

Each page has a separate original hero film, a three-chapter scroll study, context illustrations, an interactive buyer brief, sourcing links, and buyer questions. Landing category cards open the pages without changing Buy/Sell destinations. Every hero links to the other industry pages. The sitemap includes all three routes.

## Rendering and accessibility

`IndustryMotionOpening` shares playback and theme behavior. Navbar and hero text use black ink in light mode and light ink in dark mode. Video and poster framing match; changing themes does not switch media sources. Reduced motion and Save Data start on a poster, with a keyboard-accessible opt-in/playback control. Offscreen playback pauses.

The scroll studies enhance wide, tall, motion-enabled viewports with sticky chapters. Other viewports and reduced-motion users see all chapters in normal document flow. Healthcare's report and sourcing frames use semantic HTML with illustrative metadata, not skeleton lines or real patient data. Visible panels are exposed to assistive technology; hidden transition panels are not.

Healthcare and Voice context artwork uses one bitmap with a graphite tone filter in both themes. Egocentric's context illustrations retain their registered theme variants. Artwork is illustrative, not a dataset sample, an inventory promise, a clinical claim, or supplier recording footage.

## Kept implementation

The industry source directory contains 29 route dependencies and one renderer-only component used to reproduce the current Egocentric film. Page openings and buyer briefs are required inputs; unused earlier fallback layouts and their props are removed.

The industry media directory contains 23 runtime assets plus 19 current film source images/manifests: 42 files, 69,465,826 bytes. Keep the current sources even though the browser displays their rendered films. Four Healthcare/Voice manifests record source, movie, poster, and renderer hashes.

Authoring records and commands:

- [Egocentric film](egocentric-hero-film.md): `scripts/render-industry-motion.mjs`, defaulting to the current three-shot film. Requires an existing Chromium debugging endpoint, `puppeteer-core`, FFmpeg, and the local asset server. `--check` validates without exporting.
- [Healthcare/Voice framing](healthcare-voice-hero-framing-v2.md): `scripts/render-industry-hero-film.mjs`, using the retained panoramic and portrait originals.
- [Scene artwork provenance](industry-design-assets.md): prompts and original source records, including historical editions.

Renderers refuse to overwrite existing outputs. Use a new versioned destination when reproducing films; do not regenerate during a normal deployment.

## Scoped cleanup and release checks

Eight unused component/style files, 56 superseded media files (79,603,390 bytes), and three old prototype production notes were moved to a recoverable local archive outside the repository. Original generated PNGs and unrelated local changes are preserved. The release excludes RSS, API/catalogue, client-logo, and Teams edits.

Validation includes TypeScript, scoped ESLint/Prettier, an isolated production build, runtime asset existence, four film manifests, theme/responsive story checks, and cross-page navigation. Production deployment is a separate acceptance step; a successful push or local build does not prove the hosted release.
