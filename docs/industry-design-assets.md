# Industry scene illustrations

This is an asset-generation provenance record, including superseded editions. The current runtime inventory is described in [Industry pages](industry-pages.md). Unused editions are archived outside the repository, not shipped. Healthcare and Voice now render one light bitmap with a theme tone filter instead of swapping independently generated light/dark images.

Generated with the built-in image-generation tool on 2026-09-07. No CLI generation was used. Existing dark sketches remain unchanged. The new light editions are versioned siblings, exported as WebP at quality 92 without resizing. These are illustrative scenarios, not sample customer records or evidence of available inventory.

## Editing prompt used for all nine light editions

Use case: precise-object-edit. Image 1 is the edit target. Produce a light-theme edition of this exact Kuinbee sketch. Change only the color treatment: white/off-white #f7f8fa ground, confident dark graphite and desaturated navy #1a2240 pencil strokes, subtle gray shading. Keep the original composition, aspect ratio, perspective, every person, object, hand position, framing, and panel arrangement exactly aligned with the input. This will alternate with the original when a website changes theme, so geometry must register. Preserve clear detailed environment lines and subject contours at high resolution. Crisp professional architectural drawing with restrained tonal depth. Do not wash out lines. No blur, fog, glow, new objects, text, badges, overlays, borders, photographic rendering, or decorative grids. Output landscape at least 1536 pixels wide.

## Assets

Paths are relative to the frontend/user repository. Each row is an original input and its selected output; the scene composition and display geometry are retained between themes. Generated details are illustrative rather than pixel-identical reproductions.

| Existing dark input                                                             | New light output                                                                      |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| public/images/industries/egocentric/egocentric-everyday-interaction-v1.webp     | public/images/industries/egocentric/egocentric-everyday-interaction-light-v2.webp     |
| public/images/industries/egocentric/egocentric-collaborative-task-v1.webp       | public/images/industries/egocentric/egocentric-collaborative-task-light-v2.webp       |
| public/images/industries/egocentric/egocentric-spatial-navigation-v1.webp       | public/images/industries/egocentric/egocentric-spatial-navigation-light-v2.webp       |
| public/images/industries/healthcare/healthcare-imaging-review-v1.webp           | public/images/industries/healthcare/healthcare-imaging-review-light-v2.webp           |
| public/images/industries/healthcare/healthcare-longitudinal-records-v1.webp     | public/images/industries/healthcare/healthcare-longitudinal-records-light-v2.webp     |
| public/images/industries/healthcare/healthcare-physiological-monitoring-v1.webp | public/images/industries/healthcare/healthcare-physiological-monitoring-light-v2.webp |
| public/images/industries/voice/voice-people-language-v1.webp                    | public/images/industries/voice/voice-people-language-light-v2.webp                    |
| public/images/industries/voice/voice-device-environment-v1.webp                 | public/images/industries/voice/voice-device-environment-light-v2.webp                 |
| public/images/industries/voice/voice-label-alignment-v1.webp                    | public/images/industries/voice/voice-label-alignment-light-v2.webp                    |

## Integration

The current pages use IndustryEditorialPage: an editorial title and introduction, a primary illustration paired with a buyer-use-case selector, two always-visible supporting studies, an interactive data diagram, sourcing links, and buyer questions. Native site background, typography, navigation, and footer are reused. Active scenes use reserved 3:2 frames with the same aspect ratio in both themes. Images do not contain UI labels; headings, requirements, links, and captions remain accessible HTML. The earlier tabbed IndustrySceneExplorer is no longer used by these pages.

### Buyer interactions (2026-10-02)

- IndustryHero has three keyboard-accessible use-case tabs per industry. Each explains project-specific comparison criteria; the tabs do not claim to filter inventory. The primary artwork remains unchanged. Brief panels share one grid cell, reserving the tallest content without fixed-height clipping or layout jumps. Inactive panels are hidden and inert.
- IndustryDataExplorer connects each comparison criterion to a highlighted region in the HTML/SVG data diagram. Selecting a criterion expands its explanation while keeping all diagram labels readable. Keyboard focus also updates the selected layer.
- Each supporting scene has a compact, expandable "What to review" brief. Buyer questions use the same controlled accordion treatment. Answer content remains in the server-rendered document, and closed content is hidden from assistive technology and focus.
- Motion follows the existing site grammar: 200–300ms color and arrow feedback, 500ms restrained image scale, and a one-time 16px section reveal. Selected markers use the site's spring timing. There are no idle loops, counters that imply metrics, or automatic carousels.
- IndustryMotion and the scoped interaction stylesheet honor reduced-motion preferences. The contexts jump uses the site's existing Lenis instance, offset for the navbar, and focuses the destination heading; reduced motion makes that jump immediate.
- The existing paired bitmap assets, category cards, global navbar, and footer are not changed by this interaction pass.

## Healthcare replacement set (supporting scenes)

The healthcare page uses the clinical consultation and patient monitoring below as supporting scenes. The radiology control-room scene has been replaced by the v4 ultrasound scene. Old files remain available. Generated with the built-in tool; versioned WebP exports at quality 94, without resizing. These are editorial illustrations, not clinical examples or patient records.

| Scene                  | Active light file                                                                  | Active dark file                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Radiology control room | public/images/industries/healthcare/healthcare-radiology-light-v3.webp             | public/images/industries/healthcare/healthcare-radiology-dark-v3.webp             |
| Clinical consultation  | public/images/industries/healthcare/healthcare-clinical-consultation-light-v3.webp | public/images/industries/healthcare/healthcare-clinical-consultation-dark-v3.webp |
| Patient monitoring     | public/images/industries/healthcare/healthcare-patient-monitoring-light-v3.webp    | public/images/industries/healthcare/healthcare-patient-monitoring-dark-v3.webp    |

### Light edition generation prompts

#### imaging

Use case: stylized-concept.
Asset type: healthcare industry website section illustration, landscape 3:2.
Create an original, professional editorial pencil-and-ink sketch for Kuinbee. Clean architectural draftsmanship, natural human proportions, careful facial drawing and plausible hands, confident navy-gray contours with restrained graphite crosshatching and subtle tonal shading. Off-white #f7f8fa paper, dark desaturated navy #1a2240 ink, a very small amount of muted steel-blue on equipment. Clear foreground and coherent room perspective. Three-quarter documentary view, medium distance: enough setting to understand the activity, no expansive empty scene. Keep important subjects comfortably inside the frame.
Quality: crisp fine detail at 2048 pixels wide, no softened focus, no blur. Illustration, not photography or a photorealistic render. Meaningful quiet clinical activity, not a promotional stock-photo pose.
No text, words, numbers, logos, watermark, floating icons, decorative charts, holograms, dashboard overlays, split panels, anatomical posters, giant wall displays, excessive monitors, heavy vignette, charcoal smudges, or colored background blocks. Screens and equipment must stay secondary to the clinical activity.
Scene: A modern, understated radiology control room. One seated female radiologist in plain scrubs at a small desk, viewed from a rear three-quarter side angle, reviewing one upright diagnostic monitor with a simple grayscale scan. Through the broad interior observation window behind the desk, show a realistic circular CT scanner and its empty table in a clean scanning room. The scanner, window, clinician, chair, single monitor and compact console are the only major elements. No patient on the scanner, no wall of anatomy images. The composition should communicate the acquisition setting of medical images, rather than a fantasy analysis dashboard.

#### records

Use case: stylized-concept.
Asset type: healthcare industry website section illustration, landscape 3:2.
Create an original, professional editorial pencil-and-ink sketch for Kuinbee. Clean architectural draftsmanship, natural human proportions, careful facial drawing and plausible hands, confident navy-gray contours with restrained graphite crosshatching and subtle tonal shading. Off-white #f7f8fa paper, dark desaturated navy #1a2240 ink, a very small amount of muted steel-blue on equipment. Clear foreground and coherent room perspective. Three-quarter documentary view, medium distance: enough setting to understand the activity, no expansive empty scene. Keep important subjects comfortably inside the frame.
Quality: crisp fine detail at 2048 pixels wide, no softened focus, no blur. Illustration, not photography or a photorealistic render. Meaningful quiet clinical activity, not a promotional stock-photo pose.
No text, words, numbers, logos, watermark, floating icons, decorative charts, holograms, dashboard overlays, split panels, anatomical posters, giant wall displays, excessive monitors, heavy vignette, charcoal smudges, or colored background blocks. Screens and equipment must stay secondary to the clinical activity.
Scene: A calm consultation room. A physician in plain clinical clothing and an older adult patient sit naturally across a compact desk, turned slightly toward a tablet the physician holds at a comfortable viewing angle. The clinician is reviewing and explaining the patient's record. A small closed folder and a pen are on the otherwise clear desk; a simple window and low cabinet establish the clinical environment. One clear human interaction and one record device. No charts on the walls, no visualized timeline, no exaggerated gestures or handshakes. The tablet surface has a few unobtrusive lines suggesting document structure but absolutely no readable text, numbers or fake metrics.

#### signals

Use case: stylized-concept.
Asset type: healthcare industry website section illustration, landscape 3:2.
Create an original, professional editorial pencil-and-ink sketch for Kuinbee. Clean architectural draftsmanship, natural human proportions, careful facial drawing and plausible hands, confident navy-gray contours with restrained graphite crosshatching and subtle tonal shading. Off-white #f7f8fa paper, dark desaturated navy #1a2240 ink, a very small amount of muted steel-blue on equipment. Clear foreground and coherent room perspective. Three-quarter documentary view, medium distance: enough setting to understand the activity, no expansive empty scene. Keep important subjects comfortably inside the frame.
Quality: crisp fine detail at 2048 pixels wide, no softened focus, no blur. Illustration, not photography or a photorealistic render. Meaningful quiet clinical activity, not a promotional stock-photo pose.
No text, words, numbers, logos, watermark, floating icons, decorative charts, holograms, dashboard overlays, split panels, anatomical posters, giant wall displays, excessive monitors, heavy vignette, charcoal smudges, or colored background blocks. Screens and equipment must stay secondary to the clinical activity.
Scene: A quiet outpatient monitoring room. An adult patient sits comfortably in an ordinary examination chair, with one forearm resting naturally on the chair arm. A nurse beside the chair gently fits a small fingertip pulse oximeter to the patient's extended index finger. Their hands have correct anatomy, five fingers each, natural contact and proportional medical equipment. A single small medical monitor on a stand nearby shows one restrained repeating pulse trace without words or numbers. Frame both people from roughly waist up with the chair and modest equipment; convey monitoring in an actual care setting, not a giant wrist closeup. No stethoscope props, floating waveforms, unnecessary cables or dramatic treatment.

### Dark edition edit prompt

Each corresponding light edition is the sole edit input.

Use case: precise-object-edit.
Image 1 is the edit target: the approved light-theme healthcare illustration.
Create its dark-theme edition for the same Kuinbee website. Change only the palette and tonal treatment, preserving exactly the composition, crop, aspect ratio, people, facial identity, gaze, posture, hands, furniture, equipment, screen contents and every contour position.
Use an even deep brand-navy #10182b paper background, desaturated slate and cool-gray graphite shading, fine soft-ivory and muted steel-blue pencil contours. Keep the original professional hand-drawn editorial character and crisp line detail. Give the subjects natural positive tonal modeling: skin a readable middle gray, hair darker than skin, pupils dark, equipment surfaces gently modeled. It must look like a carefully drawn illustration on dark navy paper, NOT an inverted photograph, X-ray, ghost, negative image or glowing blueprint. Clear readable subjects, modest tonal depth, restrained environment lines. No black crush or washed-out fog. No new objects, text, numbers, borders, watermark, highlights, glow or layout changes. Output exactly the same landscape framing and geometry as the input, retaining full resolution.

### Background integration

The industry frame uses the site's InstitutionalBackground in dark mode, including the standard #1a2240 / #0f1729 / #0a0f1e palette and dot/cross treatment. A 24rem bottom fade meets the existing footer. The existing DataRequestBackground remains light-only so its light palette and layout do not change.

## Editorial opening scenes (2026-10-02, active)

Generated with the built-in image-generation tool, not the CLI. Native outputs are 1536 × 1024. Exported to versioned WebP siblings at quality 94 without resizing; Next serves these illustrations at quality 92. Each opening is displayed at approximately 724px maximum desktop width rather than stretched across the viewport. The dark edition is an edit of its corresponding light image, preserving the activity and framing. Fine generated details may differ; these are illustrative scenarios, not exact sample records or inventory claims.

| Industry   | Light file                                                                    | Dark file                                                                    |
| ---------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Egocentric | public/images/industries/egocentric/egocentric-task-observation-light-v4.webp | public/images/industries/egocentric/egocentric-task-observation-dark-v4.webp |
| Healthcare | public/images/industries/healthcare/healthcare-imaging-capture-light-v4.webp  | public/images/industries/healthcare/healthcare-imaging-capture-dark-v4.webp  |
| Voice      | public/images/industries/voice/voice-natural-recording-light-v4.webp          | public/images/industries/voice/voice-natural-recording-dark-v4.webp          |

### Shared light-generation prompt

Use case: stylized-concept.
Asset type: premium Kuinbee industry website editorial illustration, landscape 3:2, render at 2400x1600 or highest available native resolution.
Style: precise, professional graphite and navy-ink sketch on cool off-white #f7f8fa paper. Use photographic observation and framing, rich confident linework, restrained crosshatching, readable midtones and real material textures. Crisp, never foggy or softened. Graphite #24324a, subtle muted steel-blue only for functional equipment. Hands, faces and body proportions must be natural. One documentary moment, well-composed foreground focal point, quieter background that stays legible. Beautiful but practical, no theatrical scene.
No visible text, numbers, branding, watermark, floating graphics, diagrams, waveform decorations, robots, holograms, grids, lens blur, vignettes, inset panels or collages. Keep the full subject and equipment inside the image, with a small comfortable margin. No giant room or sprawling furniture: frame the activity so it reads clearly at 600 pixels wide.

### Scene-specific prompt additions

Egocentric: exact participant's first-person viewpoint looking down at their own hands assembling a small wooden fixture at a neat workshop bench. Left hand holds two fitted wooden pieces steady while right hand turns one compact screwdriver. The hands and one assembly dominate the foreground. A few neatly placed tools and a slightly open parts tray establish the work context; a modest workshop shelf appears in the upper background. Real arm/hand geometry, two visible human hands total, one plausible tool-to-fastener contact. Make the visual unmistakably first-person task observation, no other people. One continuous scene, no split panels.

Healthcare: a sonographer in plain scrubs performs an abdominal ultrasound with an adult patient resting comfortably under a modest examination drape. Medium three-quarter view framed around clinician, the patient's side, the probe contact and one compact ultrasound machine. Clinician watches the one small screen with a simple grayscale sector scan, no readable UI. Patient dressed/draped modestly, natural posture, clinician hands contact realistic probe/body angle. A clean clinical wall and one curtain establish the room without clutter. Emphasize the careful real clinical activity that produces imaging data, not machinery or decorative anatomy.

Voice: two adults seated across a small recording table having a natural conversation in a quiet but ordinary room. A small physical audio recorder centered on the table and one discreet tabletop microphone on a short stand show how the speech is captured. Three-quarter medium framing, waist-up, both faces in clear profile/three-quarter view, natural attentive expressions and relaxed hands. A simple sound-absorbing panel and soft furnishings establish an actual recording setting. Show two people and modest capture equipment only, no headphones required, no studio glamour, no floating sound waves or visualized speech.

### Dark-edition edit prompt

Create a dark-theme edition of this EXACT illustration for the Kuinbee website. Preserve every subject, face, hand, tool, pose, object placement, perspective, framing, crop and line geometry exactly. Do not add or remove anything; this must visually superimpose on the original when themes change. Only change the rendering palette: deep muted navy #10182b paper/background, graphite and slate-blue midtones, confidently legible cool silver pencil contours and realistic tonal detail. Keep equipment, human faces and hands clear but understated, not shining white. This is a premium photographic-observation sketch in navy and graphite, NOT a photographic negative: do not invert skin into ghostly dark faces. Maintain all fine crosshatching, crisp background line detail and readable foreground separation. No fog, blur, glow, vignette, dramatic spotlights, text or graphics. Landscape 3:2, highest native resolution.

### Code-native explanatory visuals

IndustryDataVisual contains accessible, responsive illustrations of an aligned first-person task sequence; connected clinical events with an observation window; and an audio waveform aligned to speaker turns. These are HTML/SVG, not generated image text. They are labelled as illustrative, have no fabricated performance figures or playable-audio controls, and retain readable labels on narrow screens.

## Voice supporting replacements (2026-10-02, active)

The two older Voice illustrations with floating waveform decorations have been replaced by documentary-style sketches of speech captured in a transit station and audio annotation on a physical laptop. Both retain 3:2 framing, clear subject contrast, and paired theme editions. Generated with the built-in tool and exported at quality 94 without resizing. Light supporting sketches receive a subtle 1.08 CSS contrast treatment; dark editions keep their native treatment.

| Scene                 | Light file                                                           | Dark file                                                           |
| --------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Public-setting speech | public/images/industries/voice/voice-transit-recording-light-v4.webp | public/images/industries/voice/voice-transit-recording-dark-v4.webp |
| Audio annotation      | public/images/industries/voice/voice-audio-annotation-light-v4.webp  | public/images/industries/voice/voice-audio-annotation-dark-v4.webp  |

### Generation prompts

#### voice-environment

Use case: stylized-concept. Asset type: professional Kuinbee industry website editorial illustration, landscape 3:2, highest native resolution. Precise graphite and muted navy-ink sketch informed by documentary photography, on cool off-white #f7f8fa paper. Crisp confident outlines, finely observed human anatomy, natural material textures and restrained crosshatching. Desaturated graphite #24324a and muted steel-blue on equipment only. Clear midtone contrast with a strong foreground subject and quiet but readable context. One realistic activity, not a stock promotional pose. No visible text, numbers, logos, branding, watermark, borders, collages, inset panels, floating graphics, visualized sound, superimposed waveform decorations, holograms, grids, exaggerated perspective, smudging, fog or blur. Real physical objects only, important subjects inside comfortable frame margins; readable at 600px. Scene: a young adult woman seated on a simple bench in an ordinary covered transit station, recording a short voice message on her smartphone held naturally about 20 centimeters from her mouth. Medium three-quarter waist-up documentary view. One correctly proportioned phone and two plausible hands, speaking expression. A few commuters and one train or bus in the quietly detailed background establish ambient public noise without overpowering the woman. No floating close-up phone in the foreground, no giant hands, no sound waves, no technical dashboards. The scene should communicate real speech recorded on a consumer device in a public setting.

#### voice-annotation

Use case: stylized-concept. Asset type: professional Kuinbee industry website editorial illustration, landscape 3:2, highest native resolution. Precise graphite and muted navy-ink sketch informed by documentary photography, on cool off-white #f7f8fa paper. Crisp confident outlines, finely observed human anatomy, natural material textures and restrained crosshatching. Desaturated graphite #24324a and muted steel-blue on equipment only. Clear midtone contrast with a strong foreground subject and quiet but readable context. One realistic activity, not a stock promotional pose. No visible text, numbers, logos, branding, watermark, borders, collages, inset panels, floating graphics, visualized sound, superimposed waveform decorations, holograms, grids, exaggerated perspective, smudging, fog or blur. Real physical objects only, important subjects inside comfortable frame margins; readable at 600px. Scene: an audio annotator with comfortable over-ear headphones seated at a small normal desk, carefully reviewing a recording on one ordinary laptop. Medium three-quarter view from behind and beside the person, with laptop surface and one hand on its trackpad visible. The laptop shows a discreet simple waveform and a few short document-like rows inside the physical screen only; no readable words or numbers, no large wall display. A notebook and pencil are on the desk. Quiet practical office, not a recording studio. Natural posture, realistic hands and one clearly physical laptop. No mixing console, microphones, extra screens, ghostly gear drawings or floating waveform.

Each dark edition uses its corresponding light output as the sole edit input and the dark-edition prompt documented above.
