# Egocentric hero film

The current opening is a full-bleed, three-scene original sketch sequence: workplace packing, everyday food preparation, and practical bicycle maintenance. Each scene uses one fixed viewport and crop. The content changes through a dissolve, not a zoom, changing aspect ratio, moving frame, or reused scroll explanation. It is a sequence of original illustrations, not continuously filmed human motion or dataset footage. No Petrarch footage, frames, assets, or animation code are used.

The October 3 Healthcare/Voice extension extracts the opening into the shared `IndustryMotionOpening`, with Egocentric as a configuration wrapper. Egocentric retains the same sources, geometry, controls, and dark inversion treatment. The hero also includes understated links between all three industry pages. See [Healthcare and Voice framing](healthcare-voice-hero-framing-v2.md) and [current industry implementation](industry-pages.md).

The October 3 opening keeps only a native HTML headline and the two main links. The rotating descriptions, eyebrow, visible disclaimer, and persistent playback button have been removed. The copy is anchored 16–24px from the viewport's left edge and 28px from the bottom, not constrained to the site's centered content column. The hero occupies one full small viewport without the previous 92svh or 980px cap, keeping the next section below the initial fold.

There is no image blur, rectangular copy panel, or copy-area wash in either theme. The desktop video/poster plane uses one constant crop to trim the export's baked SVG side gutters and painted paper perimeter; `max-width: none` prevents global image/video resets from clamping that plane and leaving a sharp right strip. No camera animation or exported video asset was changed. Desktop has only a 20px bottom blend and a restrained navigation wash. Mobile keeps a controlled 1.45×width image-height cap, a 4% overscan, and a 16px image-edge blend instead of cutting most of both hands off with a full-height portrait cover crop. Small links alone have a crisp glyph-local readability edge. Dark artwork retains inversion and 0.5 brightness. Desktop type remains capped at 64px.

A native keyboard-focus-only playback button retains a stop mechanism without persistent hero chrome. Reduced-motion and Save Data start on the poster with no video source until explicit keyboard opt-in. Once opted in, pausing retains the loaded clip and position. At the user's confirmed choice, hero and navbar text are true black in light mode while dark mode retains its light text. The shared navbar's light-ink override is now limited to the three industry routes; all other routes retain their default colors. Navigation behavior, links, filled-button hover contrast, and the Capture → Structure → Source scroll component are unchanged.

## Original assets and generation

All three sources are 1536 × 1024, exported to WebP quality 94 without resizing. They were created with the built-in image-generation tool. The project-bound files are under `public/images/industries/egocentric/`.

| Shot             | Project asset                           | SHA-256                                                            |
| ---------------- | --------------------------------------- | ------------------------------------------------------------------ |
| Workplace        | `egocentric-hero-packing-light-v1.webp` | `93efe306635d8d21b53e2edccb627d711e4cbfa918e76794a24440c48b3cbeec` |
| Everyday         | `egocentric-hero-kitchen-light-v1.webp` | `18cfab5856fb979a693b91a12788e0d26834b78c6083bccdb621ef5df166c7af` |
| Practical skills | `egocentric-hero-repair-light-v1.webp`  | `db19ba0674658b5647a50fa4076353c0d8eceb9237bb7b70f8c9605116fd7b31` |

The packing original is retained at `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-cd90577b-2256-4455-98c7-71312ae9f3ff.png`, SHA-256 `05118bd5442d07593a17ae27868f70608c6ad2fe87bcebab0aaf9bf3741ada79`. Packing was supplied as a style reference only for the other two scenes. Their original PNG files remain at `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-256a4d02-7abb-4c20-8ce7-eba034ccb7e8.png` and `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-937c8f85-5cc8-4242-835a-e6dff9798c93.png`.

### Packing generation prompt

```text
Use case: stylized-concept.
Asset type: original high-detail editorial illustration for Kuinbee's Egocentric hero video, landscape 3:2, highest native resolution.
Input image 1 is a STYLE reference only, not an edit target; create a new original composition with the same professional fine graphite and restrained navy-ink sketch aesthetic.
Scene: exact participant's first-person viewpoint standing at a tidy warehouse packing bench, looking toward shelves in a modest realistic facility. The participant's two hands naturally hold a medium closed cardboard parcel just above the bench. Both hands and forearms are visible, fingers anatomically correct and naturally gripping the two sides. The parcel has only a single plain tape seam, no label. A small open parts tray and folded packing material sit on the bench, not floating. Quiet shelving, boxes and structural lines are legible behind it. No other people, forklifts, robots, or machinery. Keep hands, parcel and bench dominant, with enough real environment to establish context.
Composition: beautifully observed documentary first-person frame; clear human viewpoint, comfortable margin around both hands, one stable coherent room perspective. Leave no giant empty area and do not make a panoramic facility. Landscape 3:2.
Style: confident finely drawn pencil and ink, crisp medium-dark graphite and muted blue-gray contours on near-white cool paper. Restrained real-material crosshatching and readable medium tones, controlled line density, no lens blur or softened focus, no dramatic shadows, no glowing blueprint. Plain white matte at outer edges to blend naturally into a light page. The source must retain crisp detail when shown at 800px wide, not foggy or weak low-contrast lines.
No lettering, text, logos, branding, numbers, captions, diagrams, UI, borders, frame dividers, technical overlay, floating graphics, repeated hands, duplicated parcels, photographic rendering, vignette, smudged charcoal, dark background, gradient wash. This is one original continuous sketch scene, not a collage and not footage from a supplier dataset.
```

### Shared generation prompt

Each scene-specific paragraph below was appended to this exact shared prompt, with the packing source as the sole image reference:

```text
Use case: stylized-concept. Asset type: original Kuinbee Egocentric hero-film shot, landscape3:2, highestnative resolution. Input image1 is only a STYLE reference, not an edit target. Make a different original scene. Match its professional documentary graphite-and-navy pencil aesthetic: confident crisp contours, fine but controlled crosshatching, realistic observed anatomy, medium-dark line contrast on near-white cool paper. One exact participant's first-person viewpoint, both natural hands and forearms visible; no other people. Full coherent physical scene, hand/object contact believable, comfortable margins around the main subject. Not a third-person portrait, not photograph or fantasy. No text, numbers, logos, UI, diagrams, inset panels, collage, borders, fog, blur, glow, giant emptyspace, giant unrelatedprops, repeatedhands, anatomicalerrors. Keep the foreground action dominant, with a legible quiet real-world environment. No mechanical robot or floating graphics.
```

Kitchen:

```text
Scene: looking down at one's own hands preparing vegetables at a simple everyday kitchen counter. Left hand naturally steadies a carrot on a wooden cutting board with fingertips safely curled; right hand holds a realistically proportioned chef's knife partway through a slice, blade against the board. A few already-cut carrot rounds and two vegetables on the board, a modest bowl next to it, simple tiled backsplash and one ordinary cupboard establish a real kitchen. Hands, knife, carrot and board all comfortably inside frame. Quiet naturally observed activity, not food styling or restaurant drama. This shot must be visibly different from the warehouse reference.
```

Bicycle maintenance:

```text
Scene: exact participant's own viewpoint maintaining their bicycle outdoors beside a modest courtyard. Looking down toward the front handlebars and one brake-cable adjuster. Left hand steadies the brake lever/handlebar, right hand turns a small correctly shaped hex key at one clearly visible fastener. Both hands naturally hold real objects; two hands total, five fingers each, realistic tool-to-fastener contact. Bicycle cockpit and a modest part of the front wheel dominate foreground; a quiet courtyard wall, low work stand and plants establish the outdoor practical setting. Keep all key hands, handlebars and one small tool inside comfortable margins. No riding, speed effects or branded cycling gear. This shot must be unmistakably different from an indoor warehouse or kitchen.
```

## Timing and reproduction

`EgocentricHeroFilmScene.tsx` is a pure React SVG scene with SHA-256 `e97508e51a9e5cd2ff7cc21ffee0083c07f6e8f7fa966eca8831b3e3dc07b936`. Each shot holds unchanged for 3.2 seconds. A cosine-eased 0.8-second dissolve leads to the next, including the closing return to the first scene. There are no camera transforms. The twelve-second output is 60 fps, 720 frames, H.264, `yuv420p`, fast-start, with no audio.

The October 3 simplification removes the caption clock and all per-frame HTML opacity work. The film's original 3.2-second still holds and 0.8-second scene dissolves remain unchanged. The headline and links do not change with scenes.

Reproduction requires FFmpeg, the local frontend on port 3000, a Chromium debugging endpoint on port 9224, and an existing `puppeteer-core` installation. Pass its module directory with `--puppeteer-module /absolute/path/to/puppeteer-core` if it is not installed in the project. The endpoint must be available before running the exporter. Use an unused versioned output filename because the exporter never overwrites files:

```sh
node scripts/render-industry-motion.mjs \
  --component src/app/industries/egocentric/_components/EgocentricHeroFilmScene.tsx \
  --component-export EgocentricHeroFilmScene \
  --image-href /images/industries/egocentric/egocentric-hero-packing-light-v1.webp \
  --image-href /images/industries/egocentric/egocentric-hero-kitchen-light-v1.webp \
  --image-href /images/industries/egocentric/egocentric-hero-repair-light-v1.webp \
  --fps 60 --seconds 12 --timeline continuous --poster-progress 0 --stream \
  --output public/images/industries/egocentric/egocentric-hero-film-v1.mp4
```

Add `--compact` and select a new mobile output name for mobile. Streaming sends PNG buffers directly to FFmpeg rather than creating large frame directories. The responsive clips use identical scene order and timing. Switching themes changes only the image display treatment, not the video source, geometry, identity, or clock. Static posters use the same treatment. Older prototype assets and notes were moved to a recoverable local archive outside the repository before the scoped release.

## Export record

Both films passed FFprobe checks: H.264, `yuv420p`, 60/1 fps, 720 decoded frames, twelve-second duration, and no audio stream. Their frames at one, five and nine seconds were visually inspected to confirm the content changes while the viewport, crop and image dimensions remain fixed. Review strips are retained at `/tmp/kuinbee-hero-film-review-hkWgi1/desktop-three-shots.png` and `/tmp/kuinbee-hero-film-review-hkWgi1/mobile-three-shots.png`. Streaming staging directories and isolated browser contexts were cleaned automatically; other artifacts were not removed.

All final files are under `public/images/industries/egocentric/`.

| File                                         | Resolution  | Bytes     | SHA-256                                                            |
| -------------------------------------------- | ----------- | --------- | ------------------------------------------------------------------ |
| `egocentric-hero-film-v1.mp4`                | 1920 × 1080 | 9,962,257 | `576dedd31341a47f9c64a50ec219c08cd8d990eceae8024d84166fc637246e8a` |
| `egocentric-hero-film-v1-poster.webp`        | 1920 × 1080 | 596,724   | `1bb595de8f3ad98b64e910316c1a653134a025fbd74218f90f9fe58dbf4123b4` |
| `egocentric-hero-film-mobile-v1.mp4`         | 1080 × 936  | 5,966,443 | `457c846236e050f24896c2651954e07102ca092122e56c8fec925d579301cc3e` |
| `egocentric-hero-film-mobile-v1-poster.webp` | 1080 × 936  | 372,780   | `abb02e062b02fd44eebdc2c55d3bcf910ae54af380e4ff8fa4aba2abf88c561f` |

## October 3 Egocentric-only validation (before Healthcare/Voice extension)

A fresh isolated Chromium profile checked thirty paused frames: light and dark at widths 320, 390, 768, 1440, and 1920, with scenes held at one, five, and nine seconds. Light-mode headline, both hero links, desktop navigation links, Resources, search input and placeholder, Sign In, and Sign Up computed as `rgb(0, 0, 0)`. Dark mode retained light text. The first-fold boundary matched the viewport, without auxiliary captions, persistent playback chrome, horizontal overflow, or a sharp right-side strip.

Actual client navigation from Egocentric through Home to Healthcare and Voice removed the Egocentric navbar marker and restored the other routes' existing gray/navy text. Keyboard focus revealed the stop/play control and Space toggled playback. Theme changes retained the same paused video node and exact time; scrolling out of view and back preserved pause intent. Reduced-motion and Save Data made zero MP4 requests before deliberate keyboard Play, then allowed explicit playback and Pause. No page errors were recorded.

The final Sign Up rules were checked in both actual pointer-capability modes. Headless Chromium reported `hover: none` and retained black text even with a sticky `:hover` match. An isolated, minimized headed Chromium reported `hover: hover` and `pointer: fine`; Sign Up switched to white text over its existing navy hover gradient. Other navbar behavior and routes were not changed.

Fresh screenshots are retained under `/tmp/ego-hero-black-qa-u4ipvn/`, including `verified-1440-light-9.jpg`, `verified-1440-dark-9.jpg`, and `final-390-light-5.jpg`. Hover evidence is in `desktop-hover-signup.jpg` and `no-hover-signup.jpg`. These are local development captures; the Next.js and React Query development overlays remain unchanged. Temporary QA packages and browser profiles were kept outside the project, and all owned validation browsers were closed without stopping the user's browser or development server. TypeScript, scoped ESLint, formatting, and tracked diff whitespace checks passed. These checks do not establish hardware playback smoothness, deployment, or comprehensive accessibility certification.

## October 2 baseline validation (previous captioned UI)

The final layout passed fourteen actual-theme cases: light and dark at 320 × 780, 390 × 844, 768 × 1024, 1024 × 768, 1280 × 720, 1440 × 900, and 1920 × 1080. There was no horizontal overflow, title overflow, video error or page exception. Desktop selected the 1920 × 1080 film and mobile selected the 1080 × 936 film, both with twelve-second duration. The unchanged scroll chapters still tracked Capture, Structure and Source; Healthcare and Voice passed route-render smoke checks. Evidence: `/tmp/ego-hero-responsive-results.json`.

Independent browser checks passed held descriptions at one, five and nine seconds, paused theme-switch video identity/time/geometry, offscreen pause persistence, explicit resume, loop timing, and reduced-motion opt-in. Save Data made zero MP4 requests before explicit Play; manual Play worked. TypeScript, scoped Egocentric/exporter ESLint, and tracked diff whitespace checks passed. This is local validation, not deployment.

Final paused-frame inspection confirms no rectangular copy edge, no dark copy-area wash, and detailed side imagery. Same-frame rendered-pixel sampling of fully covered caption glyphs estimated minimum contrast of 8.52:1 for the light kitchen, 8.73:1 for light bicycle maintenance, and 5.48:1 for dark bicycle maintenance, with no sampled pixels below 4.5:1. This is a targeted diagnostic, not full accessibility certification. Final screenshots: `/tmp/ego-hero-ellipse-1440-light-5.jpg`, `/tmp/ego-hero-ellipse-1440-light-9.jpg`, and `/tmp/ego-hero-ellipse-1440-dark-9.jpg`. All isolated validation contexts were closed; the existing browser and local server were left running.

The research Chromium at port 9224 explicitly uses SwiftShader and disables GPU compositing. Its full-width dark playback tests therefore exercise software rendering and do **not** establish hardware-browser playback smoothness. The films are encoded at 60 fps; hardware playback acceptance remains a separate check. An isolated difference-blend diagnostic was faster in that software harness, but no experimental wrapper or alternate source was shipped. The active theme treatment keeps one video node, source, geometry and clock.
