#!/usr/bin/env node

// Fixed-framing original sketch film, separate from the page's scroll story.
// No browser capture, external footage, zoom, baked type, or edge blur.
import { spawn } from "node:child_process";
import { constants } from "node:fs";
import {
  access,
  copyFile,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const sources = {
  healthcare: {
    desktop: [
      "healthcare-hero-radiology-light-v2.webp",
      "healthcare-hero-laboratory-light-v2.webp",
      "healthcare-hero-wearable-light-v2.webp",
    ],
    mobile: [
      "healthcare-hero-radiology-light-mobile-v2.webp",
      "healthcare-hero-laboratory-light-mobile-v2.webp",
      "healthcare-hero-wearable-light-mobile-v2.webp",
    ],
  },
  voice: {
    desktop: [
      "voice-hero-reading-light-v2.webp",
      "voice-hero-headset-light-v2.webp",
      "voice-hero-courtyard-light-v2.webp",
    ],
    mobile: [
      "voice-hero-reading-light-mobile-v2.webp",
      "voice-hero-headset-light-mobile-v2.webp",
      "voice-hero-courtyard-light-mobile-v2.webp",
    ],
  },
};

async function run(command, args, capture = false) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", capture ? "pipe" : "inherit", "inherit"],
    });
    let output = "";
    if (capture) child.stdout.on("data", (chunk) => (output += chunk));
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve(output);
      else reject(new Error(`${command} failed: ${signal || code}`));
    });
  });
}

function hash(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function assertUnused(target) {
  try {
    await access(target);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  throw new Error(`Refusing to overwrite: ${target}`);
}

const args = process.argv.slice(2);
const industry = args[0];
const compact = args.includes("--compact");
if (
  !Object.hasOwn(sources, industry) ||
  args.some((arg, index) => index > 0 && arg !== "--compact")
) {
  throw new Error(
    "Usage: node scripts/render-industry-hero-film.mjs healthcare|voice [--compact]"
  );
}
const assetDirectory = path.join(project, "public/images/industries", industry);
const name = `${industry}-hero-film${compact ? "-mobile" : ""}-v2`;
const output = path.join(assetDirectory, `${name}.mp4`);
const poster = path.join(assetDirectory, `${name}-poster.webp`);
const manifest = path.join(assetDirectory, `${name}.json`);
await Promise.all([output, poster, manifest].map(assertUnused));
const variant = compact ? "mobile" : "desktop";
const inputs = sources[industry][variant].map((file) =>
  path.join(assetDirectory, file)
);
await Promise.all(inputs.map((file) => access(file)));
const width = compact ? 1080 : 2520;
const height = compact ? 1620 : 1200;
const staging = await mkdtemp(path.join(tmpdir(), "kuinbee-original-hero-"));
let succeeded = false;

try {
  const stagedVideo = path.join(staging, `${name}.mp4`);
  const stagedPoster = path.join(staging, `${name}-poster.webp`);
  const stagedManifest = path.join(staging, `${name}.json`);
  const durations = [4, 4.8, 4.8, 0.8];
  const ffmpegInputs = [...inputs, inputs[0]].flatMap((input, index) => [
    "-loop",
    "1",
    "-framerate",
    "60",
    "-t",
    String(durations[index]),
    "-i",
    input,
  ]);
  const planes = durations.map(
    (_, index) =>
      `[${index}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=white,setsar=1,hue=s=0,format=yuv444p,settb=1/60,setpts=PTS-STARTPTS[v${index}]`
  );
  // xfade's P moves from 1 to 0. Cosine weighting gives zero slope at joins.
  const mix = "(1-cos(PI*(1-P)))/2";
  const expression = `A*(1-(${mix}))+B*(${mix})`;
  const dissolves = [
    `[v0][v1]xfade=transition=custom:duration=0.8:offset=3.2:expr='${expression}'[one]`,
    `[one][v2]xfade=transition=custom:duration=0.8:offset=7.2:expr='${expression}'[two]`,
    `[two][v3]xfade=transition=custom:duration=0.8:offset=11.2:expr='${expression}',format=yuv420p[film]`,
  ];
  await run("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-n",
    "-filter_complex_threads",
    "1",
    ...ffmpegInputs,
    "-filter_complex",
    [...planes, ...dissolves].join(";"),
    "-map",
    "[film]",
    "-an",
    "-t",
    "12",
    "-r",
    "60",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "17",
    "-threads",
    "2",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-map_metadata",
    "-1",
    stagedVideo,
  ]);
  const probe = JSON.parse(
    await run(
      "ffprobe",
      [
        "-v",
        "error",
        "-count_frames",
        "-show_streams",
        "-show_format",
        "-of",
        "json",
        stagedVideo,
      ],
      true
    )
  );
  const streams = probe.streams;
  const video = streams.find((stream) => stream.codec_type === "video");
  if (
    streams.length !== 1 ||
    video.codec_name !== "h264" ||
    video.width !== width ||
    video.height !== height ||
    video.pix_fmt !== "yuv420p" ||
    video.avg_frame_rate !== "60/1" ||
    Number(video.nb_read_frames) !== 720 ||
    Math.abs(Number(probe.format.duration) - 12) > 0.02
  )
    throw new Error(`Unexpected film properties: ${JSON.stringify(probe)}`);
  await run("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-n",
    "-i",
    stagedVideo,
    "-frames:v",
    "1",
    "-c:v",
    "libwebp",
    "-quality",
    "94",
    stagedPoster,
  ]);
  const inputRecord = await Promise.all(
    inputs.map(async (input) => ({
      path: path.relative(project, input),
      sha256: hash(await readFile(input)),
    }))
  );
  const record = {
    industry,
    illustrative: true,
    datasetFootage: false,
    inputs: inputRecord,
    variant,
    sourceFormat: compact ? "2:3 portrait" : "21:10 panoramic",
    width,
    height,
    fps: 60,
    frames: 720,
    seconds: 12,
    holdSeconds: 3.2,
    dissolveSeconds: 0.8,
    easing: "cosine",
    audio: false,
    framing:
      "fixed complete-source export with proportional scaling and neutral white padding; no source crop, camera transform, or baked edge fade",
    displayFraming:
      "edge-to-edge CSS cover on an unscaled viewport plane; responsive crop depends on viewport aspect ratio",
    output: path.relative(project, output),
    poster: path.relative(project, poster),
    videoSha256: hash(await readFile(stagedVideo)),
    posterSha256: hash(await readFile(stagedPoster)),
    rendererSha256: hash(await readFile(fileURLToPath(import.meta.url))),
  };
  await writeFile(stagedManifest, `${JSON.stringify(record, null, 2)}\n`, {
    flag: "wx",
  });
  // Exclusive-create protects both previous work and concurrent export runs.
  await copyFile(stagedVideo, output, constants.COPYFILE_EXCL);
  await copyFile(stagedPoster, poster, constants.COPYFILE_EXCL);
  await copyFile(stagedManifest, manifest, constants.COPYFILE_EXCL);
  succeeded = true;
  process.stdout.write(`${JSON.stringify(record)}\n`);
} finally {
  if (succeeded) await rm(staging, { recursive: true });
  else process.stderr.write(`Failed render retained at ${staging}\n`);
}
