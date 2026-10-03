# Healthcare and Voice hero framing — v2

## Scope and composition

Version 2 replaces only the Healthcare and Voice hero films and posters. Their headlines, sourcing links, scroll stories, buyer briefs, and lower-page artwork remain unchanged. Egocentric retains its existing assets and framing.

The hero uses a full-viewport media plane with `object-fit: cover`, without an extra CSS enlargement. Wide desktop illustrations and independently composed portrait illustrations replace tight source compositions; essential interactions stay inside the frame rather than relying on oversized close-ups. Native HTML headlines and links remain at the bottom-left. There is no baked-in text, moving crop, broad edge fade, or blurred bezel.

Each responsive film uses the same artwork and framing in both themes. Theme styling changes the graphite tone, not the source, scene, or playback clock. The hero sequence is separate from the interactive scroll study.

## Original scene plan and sources

All paths below are relative to `public/images/industries/`. Desktop originals are 1817 × 866; portrait originals are 1024 × 1536.

| Scene                   | Desktop source                                        | Portrait source                                              |
| ----------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| Radiology review        | `healthcare/healthcare-hero-radiology-light-v2.webp`  | `healthcare/healthcare-hero-radiology-light-mobile-v2.webp`  |
| Laboratory microscope   | `healthcare/healthcare-hero-laboratory-light-v2.webp` | `healthcare/healthcare-hero-laboratory-light-mobile-v2.webp` |
| Wrist-sensor research   | `healthcare/healthcare-hero-wearable-light-v2.webp`   | `healthcare/healthcare-hero-wearable-light-mobile-v2.webp`   |
| Narrator reading        | `voice/voice-hero-reading-light-v2.webp`              | `voice/voice-hero-reading-light-mobile-v2.webp`              |
| Headset testing         | `voice/voice-hero-headset-light-v2.webp`              | `voice/voice-hero-headset-light-mobile-v2.webp`              |
| Courtyard voice message | `voice/voice-hero-courtyard-light-v2.webp`            | `voice/voice-hero-courtyard-light-mobile-v2.webp`            |

These are original concept illustrations, not patient data, clinical findings, voice recordings, transcripts, or dataset samples. They do not demonstrate clinical suitability or a Kuinbee annotation service.

## Export configuration

The renderer is `scripts/render-industry-hero-film.mjs`. Target exports are 2520 × 1200 desktop and 1080 × 1620 portrait: twelve seconds at 60 fps, with 3.2-second scene holds and 0.8-second cosine-eased dissolves. The final dissolve returns to the first scene. Film timing is fixed; scroll position does not control hero playback.

For each industry, outputs follow this naming scheme:

- `{industry}/{industry}-hero-film-v2.mp4`
- `{industry}/{industry}-hero-film-v2-poster.webp`
- `{industry}/{industry}-hero-film-mobile-v2.mp4`
- `{industry}/{industry}-hero-film-mobile-v2-poster.webp`

Corresponding JSON manifests record export settings and source/output hashes. Superseded versions are preserved in a recoverable local archive outside the repository. The source and export aspect ratios are closely matched so the display does not need to conceal wide baked-in gutters with a second enlargement.

## Evidence status

All four exports completed and passed FFprobe validation: H.264, yuv420p, one silent video stream, exactly 720 frames at 60 fps, twelve-second duration, and fast-start MP4. Their JSON manifests match every source, movie, poster and renderer hash. Superseded v1 files are archived rather than shipped.

| Export              | Dimensions  |      Bytes |
| ------------------- | ----------- | ---------: |
| Healthcare desktop  | 2520 × 1200 | 10,341,661 |
| Healthcare portrait | 1080 × 1620 |  6,411,570 |
| Voice desktop       | 2520 × 1200 | 13,391,933 |
| Voice portrait      | 1080 × 1620 |  8,560,182 |

Fresh isolated Chromium acceptance passed 96 held scenes: two industries × three scenes × two actual themes × eight viewport sizes (320×760, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080, 1920×800, 1440×720). It projects manually reviewed people/head/hand/equipment boxes through both export scaling and actual CSS cover, not only DOM overflow. Primary bodies and equipment stay inside the visible frame; film planes cover the viewport, native-source edge rounding remains at most two CSS pixels, and the next section stays outside the first fold. Source hashes verify all twelve hero inputs are distinct from the six rendered story/lower-page images.

Theme switching retains the same video node, source, geometry and paused clock. Light-mode headline ink is true black; dark tone filters resolve over the exact website background. Six Egocentric regression cases retained its previous sources, geometry and dark filter. Eight reduced-motion/Save Data checks made zero automatic MP4 requests before explicit keyboard opt-in, then loaded only the selected responsive source. Four normal-playback checks passed offscreen pause/resume and persistent manual pause; six responsive checks matched phone/portrait-tablet/desktop video and poster selections. No runtime or hydration failures were recorded. All owned browser instances closed normally; the user's server and browser were left running.

Voice's ultrawide courtyard includes peripheral foreground foliage. The headline uses the same crisp one-pixel, glyph-local background edge as the links to protect readability, without introducing a panel, fog, broad fade, or image blur. Formal contrast compliance, hardware playback smoothness, and cross-browser certification are not claimed. Both routes return HTTP 200 locally. TypeScript, scoped ESLint/Prettier, renderer syntax and tracked diff whitespace checks pass. Nothing was pushed or deployed.

## Image generation record

The image-generation skill guided original raster generation and scene-preserving responsive edits. All final assets use the built-in image generator, then quality-94 WebP conversion without bitmap cropping or resizing. The six first-pass 16:9 illustrations were style/scene masters, not final desktop artwork. Their generated originals remain preserved; only the independently recomposed panoramic and portrait outputs below are used by the heroes. No reference-site footage is used.

### Shared first-pass prompt

Style-only references were `public/images/industries/healthcare/healthcare-hero-consultation-light-v1.webp` and `public/images/industries/voice/voice-hero-conversation-light-v1.webp`. They were not final hero sources or edit targets. The first-pass generated scene masters referenced by the portrait and panoramic edits are preserved here:

- healthcare / healthcare-hero-radiology-light-v2.webp: `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-d5f62b0b-8c48-484c-ac22-0dfb3fab19fe.png`
- healthcare / healthcare-hero-laboratory-light-v2.webp: `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-aacf5d1b-08e0-4a77-a0a8-2f00ad11b94b.png`
- healthcare / healthcare-hero-wearable-light-v2.webp: `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-751ac870-5c06-467a-894f-24096ffb205a.png`
- voice / voice-hero-reading-light-v2.webp: `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-7a83367e-31ef-4139-8ab9-a55997bac0a5.png`
- voice / voice-hero-headset-light-v2.webp: `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-362cca9c-b2ab-4ce8-bff0-acaf7eababe2.png`
- voice / voice-hero-courtyard-light-v2.webp: `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-918e1b35-9928-4851-963a-9dce2ed8456a.png`

```text
Use case: stylized-concept. Asset type: original Kuinbee industry HERO-ONLY graphite illustration, NOT a scroll-story illustration. Input image1 is a STYLE reference ONLY; generate a different scene, do not copy its people, composition, equipment or event. Wide establishing view, landscape16:9, highest native resolution. Professional precise hand-drawn graphite, confident architectural contours and controlled fine crosshatching, medium-to-high line contrast on cool near-white paper, tiny restrained navy details. Environmental context is the majority of the image, NOT a giant face, hands, monitor or equipment close-up. Complete relevant person, face, natural hands and principal equipment comfortably within the central60% width and central65% height, with generous drawn room context all around. Keep quiet pale floor or desk foreground in the lower-left quarter for black HTML page text. Draw through all four edges; no borders, white gutters, vignette, perimeter fade, blur, fog, glow, watercolor, excessive paper grain, UI labels, words, letters, numbers, logos or watermarks. No collage, diagram, split-screen, arrows, action annotation boxes or interface. Correct human proportions, natural hands, believable objects. All key subject details fully in frame; pull the viewpoint back. No ultrasound, no doctor consulting a patient across a table, no fingertip-sensor scene, no two-person conversation across a tabletop microphone, no train platform, no audio-annotation laptop waveform. Scene:
```

### Shared portrait-edit prompt

Append the same corresponding scene paragraph below. Each edit referenced its first-pass generated illustration and re-drew a portrait establishing view.

```text
Use case: stylized-concept. Asset type: mobile portrait variant of the attached Kuinbee hero-only graphite scene. Recompose this SAME scene, same one person, same clothes, same task and principal equipment in a NEW VERTICAL PORTRAIT 2:3 canvas at highest native resolution. Do not zoom into the original or crop a rectangle from it. Pull the camera back, make the complete person and action moderately smaller, and redraw the room/courtyard naturally above and below. Keep the complete head, both hands, interaction object, seated legs, chair/bench and equipment comfortably inside the central 70% width and central 60% height with breathing room; feet and main equipment must not touch edges. Keep the subject in the upper-middle of the portrait with quiet, lightly detailed pale floor/paving in the lower 25% for black HTML text. Preserve crisp precise graphite contours and medium-high line contrast with controlled fine crosshatching on cool near-white paper, restrained navy details. Draw environmental context all the way to all four edges. No white gutters, letterbox, giant face, cropped hands/equipment, blur, fog, edge fade, vignette, dark corner bag, excessive paper grain, words, labels, numbers, interface, logos or watermarks. It should read as a comfortably framed portrait establishing view, not a close-up. Scene continuity:
```

### Shared panoramic-edit prompt

Append the same corresponding scene paragraph below. Each edit referenced its first-pass generated illustration and re-drew a true 21:10 establishing view.

```text
Use case: stylized-concept. Asset type: true ULTRA-WIDE Kuinbee hero graphite panorama, requested aspect ratio21:10 (2.1:1 landscape canvas), highest native quality. Recompose the attached hero scene as a much WIDER, farther-back establishing view of the SAME room/courtyard with the SAME single person, clothes, action and equipment. Extend the architecture/environment naturally to both sides; NOT a crop, resize, zoom, letterbox, split-screen or a small picture with whitespace around it. Draw detailed crisp environmental context all the way to all four edges with NO white gutters or flat margins. Make the complete person, head, both natural hands, active object, seated legs and principal equipment smaller: all main subject/action must fit inside x43% to68% of the total canvas and y22% to76% of the canvas; allow generous drawn background around them. The COMPLETE person from head to feet and all essential equipment MUST be comfortably inside that safe zone, not giant. Keep the lower-left quarter a lightly drawn quiet pale floor/paving for black HTML text. Preserve exact professional hand-drawn graphite style, clean architectural contours and medium-to-high line contrast, controlled fine crosshatching, cool near-white paper, tiny navy accents. No blur, perimeterfade, fog, vignette, excessivepapergrain, giantportrait, close-up, croppedface/hands, labels, numbers, words, logos or watermark. Actual21:10 panoramic composition, not16:9 with bars. Scene continuity:
```

### Scene paragraphs

### healthcare: healthcare-hero-radiology-light-v2.webp

A quiet radiology reading room viewed from a few steps back. One radiologist in a light clinical coat sits at a compact workstation in the middle of the room, reviewing two ordinary monitors with small generic grayscale cross-section images. The radiologist's complete head, arms and natural hands, chair and full monitor silhouettes are comfortably surrounded by shelving, a window and a simple clean office floor. No diagnostic finding, overlays, readable screen text, ultrasound equipment, patient or treatment. A broad lightly detailed pale floor and modest desk front form the lower-left foreground.

### healthcare: healthcare-hero-laboratory-light-v2.webp

An ordinary clinical research laboratory viewed from several steps back. One lab professional in a pale coat and simple gloves works at a compact optical microscope on a bench in the center, with a small closed slide tray. Complete head, hands, microscope and bench interaction all fit with breathing room. Cabinets and one small desktop monitor are secondary context, not a giant close-up. A clean empty pale bench front and floor make the lower-left foreground. No exposed specimen, blood, syringe, biosafety fantasy, diagnostic interface, actual patient data or printed labels.

### healthcare: healthcare-hero-wearable-light-v2.webp

A calm health-research measurement room, seen in a wide establishing view. One adult participant in a light long-sleeve shirt sits at a small desk, looking naturally down while fastening an ordinary wrist-worn sensor with their other hand. A closed notebook and modest simple tablet are at the desk; no waveform labels or medical reading. Complete face, both hands, wrist sensor, seated posture and chair are safely inside the central part of the picture. Clear room, window, cabinets and pale floor establish the space. No nurse, fingertip clip, bed, ultrasound, clinical treatment or doctor conversation.

### voice: voice-hero-reading-light-v2.webp

A wide view inside a modest voice recording booth. One adult narrator in a light sweater sits at a small desk reading from a modest open book toward a compact microphone on a stand. The adult's entire head, both natural hands, book and complete microphone all fit comfortably within the middle of the scene. A simple window to the control room and subdued acoustic panels establish the surrounding recording environment. No second speaker, no giant microphone, no laptop waveform or podcast table. Pale desk front and lightly detailed floor occupy the lower-left foreground; pages have no readable text.

### voice: voice-hero-headset-light-v2.webp

A wide view of a quiet ordinary office room. A single adult speech-system tester in a pale shirt wears a lightweight headset with a small boom microphone, seated at a compact desk with an unbranded simple laptop and a closed notebook. They speak naturally, one hand resting on the desk, both hands and full face visible; a believable complete seated posture inside the center of the canvas. Open shelving and a window provide architectural context. No two-person conversation, no giant head, no exposed audio waveform, no transcript interface, no third person. Quiet pale floor and desk front in the lower-left.

### voice: voice-hero-courtyard-light-v2.webp

An outdoor voice message captured in an ordinary quiet courtyard. One adult in a pale jacket sits on a simple bench in the middle distance and speaks naturally toward an unbranded smartphone. Complete face, both hands, phone, upper body and seated legs are clearly framed; person is modestly sized within the environment, not a portrait close-up. Plants, courtyard wall, light tiled paving and one doorway are legible surrounding context. No station, train, bus, crowd, tabletop microphone, headset or notebook. The lower-left foreground is quiet pale paving, with fine crisp lines and no dark bag.

### Generated originals and final project assets

Final project assets are listed in the scene table above. Original PNGs are retained at the following paths:

- `healthcare-hero-radiology-light-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-66f54b9b-e501-4529-8892-9dd7d799246e.png`
- `healthcare-hero-laboratory-light-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-1eff8ea1-19f7-40f6-ac68-ba738d895e43.png`
- `healthcare-hero-wearable-light-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-d5fc2ccd-b0df-4ef8-abde-53c8f8835dc8.png`
- `voice-hero-reading-light-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-7c88a642-0eb4-4383-afb9-be9f06ee2999.png`
- `voice-hero-headset-light-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-bfd4a78d-0635-464d-8a2d-3cd075e02912.png`
- `voice-hero-courtyard-light-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-0a15d138-d050-4624-ac7d-d3c5c86de715.png`
- `healthcare-hero-radiology-light-mobile-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-aad88a94-19c9-4026-bd91-5530706e7937.png`
- `healthcare-hero-laboratory-light-mobile-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-0b3f623f-8d0c-44d5-a22d-14c9edaa1eb7.png`
- `healthcare-hero-wearable-light-mobile-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-8a127d92-61f7-4396-992d-73903e054a9e.png`
- `voice-hero-reading-light-mobile-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-3d023de2-f744-4b04-8078-236fa77f2320.png`
- `voice-hero-headset-light-mobile-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-5d0b91a6-872f-4e91-af36-5772838af110.png`
- `voice-hero-courtyard-light-mobile-v2.webp` ← `/home/t_glinux/.codex/generated_images/01a0633c-1555-7903-a758-7f1d6644084f/exec-5e52009b-1fee-4104-b09b-04e5f75edb50.png`

### Responsive framing detail

Healthcare portrait media uses 70% horizontal positioning to keep both radiology monitors inside narrow phones; Voice remains centered. This affects both video and poster identically. The hero is edge-to-edge: responsive cover can trim peripheral room context, never uses an extra enlargement, and is checked against actual protected people and equipment rather than only DOM boxes. Native and export aspect ratios match closely: exact 2:3 mobile and near-exact 21:10 desktop, with at most pixel-rounding matte in the desktop export. It is not a promise to show every incidental architectural edge at every viewport.
