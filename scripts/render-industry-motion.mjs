#!/usr/bin/env node

import { constants, existsSync } from "node:fs";
import {
  access,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const projectRequire = createRequire(path.join(projectRoot, "package.json"));
const assetRoot = path.join(projectRoot, "public/images/industries/egocentric");
const defaultComponent = path.join(
  projectRoot,
  "src/app/industries/egocentric/_components/EgocentricHeroFilmScene.tsx"
);
const defaultPuppeteerModule = "puppeteer-core";
const desktopRenderSettings = {
  width: 1920,
  height: 1080,
  fps: 60,
  seconds: 12,
};
let interrupted = false;
let activeEncoder;

const usage = `Render Kuinbee's original Egocentric React SVG to an MP4.

Usage:
  node scripts/render-industry-motion.mjs [options]

Options:
  --output PATH            New .mp4 under public/images/industries/egocentric
                           Default: .../egocentric-hero-film-v1.mp4, or
                           .../egocentric-hero-film-mobile-v1.mp4 with --compact
  --poster PATH            New .webp in the same asset directory
                           Default: output basename + -poster.webp
  --component PATH         Pure React TSX component (default EgocentricHeroFilmScene)
  --component-export NAME  Named React export, default EgocentricHeroFilmScene
  --base-url URL           Local asset server, default http://localhost:3000
  --image-href PATH_OR_URL  Original image in the Egocentric asset directory;
                           repeat for optional imageHrefs keyframes
  --poster-progress NUMBER Poster pose from 0 to 1, default 0
  --fps NUMBER             Integer frame rate from 24 to 60, default 60
  --seconds NUMBER         Duration from 1 to 60 seconds, default 12;
                           fps multiplied by seconds must be an integer
  --timeline NAME          continuous (default), or forward-hold-reverse
  --cdp-url URL            Existing browser, default http://127.0.0.1:9224
  --puppeteer-module PATH  Existing puppeteer-core installation
  --font-file PATH         Inter Latin WOFF2; otherwise discover the local Next font
  --compact                Render the mobile scene at 1080x936 (viewBox 600x520)
  --stream                 Pipe PNGs directly to ffmpeg without frame files;
                           incompatible with --keep-frames / --preview-only
  --keep-frames            Retain private frame directory after success
  --preview-only           Capture representative poses to a private temporary directory
  --check                  Validate component and inputs without rendering
  --help                   Print this help

Outputs are never overwritten. Use a new versioned filename for another run.
The default 12-second loop renders the current three-scene hero film. A continuous timeline
samples phase from 0 up to, but not including, 1 with no holds or reversal.
Continuous components must return matching geometry and velocity at phase 0/1.
`;

function readArguments(argv) {
  const options = {
    output: undefined,
    component: defaultComponent,
    componentExport: "EgocentricHeroFilmScene",
    baseUrl: "http://localhost:3000",
    imageHrefs: [],
    posterProgress: 0,
    fps: desktopRenderSettings.fps,
    seconds: desktopRenderSettings.seconds,
    timeline: "continuous",
    cdpUrl: "http://127.0.0.1:9224",
    puppeteerModule: defaultPuppeteerModule,
    keepFrames: false,
    stream: false,
    compact: false,
    previewOnly: false,
    check: false,
    help: false,
  };
  const values = {
    "--output": "output",
    "--poster": "poster",
    "--component": "component",
    "--component-export": "componentExport",
    "--base-url": "baseUrl",
    "--poster-progress": "posterProgress",
    "--fps": "fps",
    "--seconds": "seconds",
    "--timeline": "timeline",
    "--cdp-url": "cdpUrl",
    "--puppeteer-module": "puppeteerModule",
    "--font-file": "fontFile",
  };
  for (let index = 0; index < argv.length; index++) {
    const option = argv[index];
    if (option === "--help") options.help = true;
    else if (option === "--keep-frames") options.keepFrames = true;
    else if (option === "--stream") options.stream = true;
    else if (option === "--compact") options.compact = true;
    else if (option === "--preview-only") {
      options.previewOnly = true;
      options.keepFrames = true;
    } else if (option === "--check") options.check = true;
    else if (option === "--image-href" || values[option]) {
      const value = argv[++index];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${option}.`);
      }
      if (option === "--image-href") options.imageHrefs.push(value);
      else options[values[option]] = value;
    } else throw new Error(`Unknown argument: ${option}. Use --help.`);
  }
  options.output = path.resolve(
    projectRoot,
    options.output ??
      path.join(
        assetRoot,
        options.compact
          ? "egocentric-hero-film-mobile-v1.mp4"
          : "egocentric-hero-film-v1.mp4"
      )
  );
  options.poster = path.resolve(
    projectRoot,
    options.poster ?? options.output.replace(/\.mp4$/i, "-poster.webp")
  );
  options.component = path.resolve(projectRoot, options.component);
  if (options.stream && options.keepFrames) {
    throw new Error(
      "--stream cannot be combined with --keep-frames or --preview-only."
    );
  }
  if (!/^[A-Za-z_$][\w$]*$/.test(options.componentExport)) {
    throw new Error("--component-export must name a valid JavaScript export.");
  }
  options.fps = Number(options.fps);
  if (!Number.isInteger(options.fps) || options.fps < 24 || options.fps > 60) {
    throw new Error("--fps must be an integer from 24 to 60.");
  }
  options.seconds = Number(options.seconds);
  if (
    !Number.isFinite(options.seconds) ||
    options.seconds < 1 ||
    options.seconds > 60 ||
    Math.abs(
      options.fps * options.seconds - Math.round(options.fps * options.seconds)
    ) > 1e-7
  ) {
    throw new Error(
      "--seconds must be from 1 to 60 and produce an integer number of frames."
    );
  }
  if (!["forward-hold-reverse", "continuous"].includes(options.timeline)) {
    throw new Error("--timeline must be forward-hold-reverse or continuous.");
  }
  options.posterProgress = Number(options.posterProgress);
  if (
    !Number.isFinite(options.posterProgress) ||
    options.posterProgress < 0 ||
    options.posterProgress > 1
  ) {
    throw new Error("--poster-progress must be between 0 and 1.");
  }
  return options;
}

function isInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return (
    relative !== "" &&
    !relative.startsWith(`..${path.sep}`) &&
    relative !== ".." &&
    !path.isAbsolute(relative)
  );
}

async function verifyOutput(output, extension) {
  if (
    !isInside(assetRoot, output) ||
    path.extname(output).toLowerCase() !== extension
  ) {
    throw new Error(
      `Output must be a ${extension} file under ${assetRoot}: ${output}`
    );
  }
  if (existsSync(output)) {
    throw new Error(
      `Refusing to overwrite ${output}. Choose a new versioned filename.`
    );
  }
  const realAssetRoot = await realpath(assetRoot);
  let existingParent = path.dirname(output);
  while (!existsSync(existingParent))
    existingParent = path.dirname(existingParent);
  const realParent = await realpath(existingParent);
  if (realParent !== realAssetRoot && !isInside(realAssetRoot, realParent)) {
    throw new Error(
      `Output parent resolves outside the approved asset directory: ${output}`
    );
  }
}

async function resolveImageInputs(options) {
  const baseUrl = new URL(options.baseUrl);
  if (
    !["localhost", "127.0.0.1", "[::1]"].includes(baseUrl.hostname) ||
    !["http:", "https:"].includes(baseUrl.protocol)
  ) {
    throw new Error("--base-url must point to the local asset server.");
  }
  const inputs = options.imageHrefs.length
    ? options.imageHrefs
    : [
        "/images/industries/egocentric/egocentric-hero-packing-light-v1.webp",
        "/images/industries/egocentric/egocentric-hero-kitchen-light-v1.webp",
        "/images/industries/egocentric/egocentric-hero-repair-light-v1.webp",
      ];
  return Promise.all(
    inputs.map(async (input) => {
      const url = new URL(input, baseUrl);
      if (
        url.origin !== baseUrl.origin ||
        !url.pathname.startsWith("/images/industries/egocentric/")
      ) {
        throw new Error(
          `Image must be an original local Egocentric asset: ${input}`
        );
      }
      const sourcePath = path.resolve(
        projectRoot,
        "public",
        `.${decodeURIComponent(url.pathname)}`
      );
      if (!isInside(assetRoot, sourcePath))
        throw new Error(`Image path escapes the asset directory: ${input}`);
      const source = await readFile(sourcePath);
      return {
        href: url.href,
        sourcePath,
        sha256: createHash("sha256").update(source).digest("hex"),
      };
    })
  );
}

async function loadComponent(
  sourcePath,
  compact = false,
  exportName = "EgocentricHeroFilmScene"
) {
  const source = await readFile(sourcePath, "utf8");
  if (compact && !/\bcompact\??\s*:/.test(source)) {
    throw new Error(
      "Compact exports require a compact prop in the scene component."
    );
  }
  const typescript = projectRequire("typescript");
  const compilation = typescript.transpileModule(source, {
    fileName: sourcePath,
    reportDiagnostics: true,
    compilerOptions: {
      jsx: typescript.JsxEmit.ReactJSX,
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  const errors =
    compilation.diagnostics?.filter(
      (diagnostic) =>
        diagnostic.category === typescript.DiagnosticCategory.Error
    ) ?? [];
  if (errors.length) {
    throw new Error(
      errors
        .map((error) =>
          typescript.flattenDiagnosticMessageText(error.messageText, "\n")
        )
        .join("\n")
    );
  }
  const compiledModule = { exports: {} };
  const allowedModules = new Set([
    "react",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
  ]);
  const context = vm.createContext({
    module: compiledModule,
    exports: compiledModule.exports,
    require(specifier) {
      if (!allowedModules.has(specifier)) {
        throw new Error(
          `Motion scene must be pure React; unsupported import: ${specifier}`
        );
      }
      return projectRequire(specifier);
    },
  });
  new vm.Script(compilation.outputText, { filename: sourcePath }).runInContext(
    context,
    { timeout: 5000 }
  );
  const component = compiledModule.exports[exportName];
  if (typeof component !== "function") {
    throw new Error(
      `Component must export ${exportName}({ progress, idPrefix?, imageHref?, imageHrefs? }).`
    );
  }
  const React = projectRequire("react");
  const { renderToStaticMarkup } = projectRequire("react-dom/server");
  return {
    sha256: createHash("sha256").update(source).digest("hex"),
    render(progress, imageInputs) {
      if (imageInputs.length > 1 && !/\bimageHrefs\??\s*:/.test(source)) {
        throw new Error(
          "Multiple image inputs require an imageHrefs prop in the scene component."
        );
      }
      const markup = renderToStaticMarkup(
        React.createElement(component, {
          progress,
          compact,
          idPrefix: "industry-motion-export",
          imageHref: imageInputs[0].href,
          ...(imageInputs.length > 1
            ? { imageHrefs: imageInputs.map((input) => input.href) }
            : {}),
        })
      );
      const expectedViewBox = compact ? "0 0 600 520" : "0 0 1200 720";
      if (
        !/^<svg[\s>]/.test(markup) ||
        !markup.includes(`viewBox="${expectedViewBox}"`)
      ) {
        throw new Error(
          `Motion scene must return one SVG root with viewBox='${expectedViewBox}'.`
        );
      }
      return markup;
    },
  };
}

async function loadTypeface(options) {
  let sourcePath =
    options.fontFile && path.resolve(projectRoot, options.fontFile);
  for (const directory of [".next/dev/static/chunks", ".next/static/css"]) {
    if (sourcePath) break;
    const absoluteDirectory = path.join(projectRoot, directory);
    if (!existsSync(absoluteDirectory)) continue;
    const stylesheets = (await readdir(absoluteDirectory))
      .filter((name) => name.endsWith(".css"))
      .sort();
    for (const stylesheet of stylesheets) {
      const stylesheetPath = path.join(absoluteDirectory, stylesheet);
      const source = await readFile(stylesheetPath, "utf8");
      const blocks = source.match(/@font-face\s*\{[^}]*\}/g) ?? [];
      const latin = blocks.find(
        (block) =>
          /font-family:\s*["']?Inter["']?\s*;/.test(block) &&
          /unicode-range:\s*U\+(?:00\?\?|0000-00FF|0-FF)/i.test(block)
      );
      const relativeFont = latin?.match(
        /url\(["']?([^"')]+\.woff2)["']?\)/
      )?.[1];
      if (relativeFont) {
        const candidate = relativeFont.startsWith("/_next/")
          ? path.join(
              projectRoot,
              ".next",
              relativeFont.slice("/_next/".length)
            )
          : path.resolve(path.dirname(stylesheetPath), relativeFont);
        if (existsSync(candidate)) {
          sourcePath = candidate;
          break;
        }
      }
    }
  }
  if (!sourcePath || path.extname(sourcePath).toLowerCase() !== ".woff2") {
    throw new Error(
      "Could not locate the site's Inter Latin WOFF2. Start the dev server or provide --font-file."
    );
  }
  const font = await readFile(sourcePath);
  return {
    sourcePath,
    sha256: createHash("sha256").update(font).digest("hex"),
    dataUrl: `data:font/woff2;base64,${font.toString("base64")}`,
  };
}

function progressAtFrame(frame, renderSettings, timeline) {
  const phase = frame / Math.round(renderSettings.fps * renderSettings.seconds);
  if (timeline === "continuous") return phase;
  // Preserve the original 3:1:3:1 trajectory at any requested duration/fps.
  if (phase < 3 / 8) return phase / (3 / 8);
  if (phase < 4 / 8) return 1;
  if (phase < 7 / 8) return 1 - (phase - 4 / 8) / (3 / 8);
  return 0;
}

function runCommand(executable, args) {
  if (interrupted) throw new Error("Rendering interrupted.");
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    activeEncoder = child;
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data) => {
      stdout += data;
    });
    child.stderr.on("data", (data) => {
      stderr += data;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (activeEncoder === child) activeEncoder = undefined;
      if (code !== 0)
        reject(new Error(`${executable} exited ${code}: ${stderr.trim()}`));
      else resolve(stdout.trim());
    });
  });
}

function videoEncoderArguments(inputArguments, frameCount, output) {
  return [
    "-hide_banner",
    "-loglevel",
    "error",
    "-nostdin",
    "-n",
    ...inputArguments,
    "-frames:v",
    String(frameCount),
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "18",
    "-threads",
    "1",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-map_metadata",
    "-1",
    "-metadata",
    "creation_time=1970-01-01T00:00:00Z",
    output,
  ];
}

function createStreamingEncoder(args) {
  if (interrupted) throw new Error("Rendering interrupted.");
  const child = spawn("/usr/bin/ffmpeg", args, {
    stdio: ["pipe", "ignore", "pipe"],
  });
  activeEncoder = child;
  let closed = false;
  let failure;
  let stderr = "";
  child.stderr.on("data", (data) => {
    stderr = `${stderr}${data}`.slice(-65536);
  });
  child.stdin.on("error", (error) => {
    failure ??= error;
    child.kill("SIGTERM");
  });
  const completion = new Promise((resolve, reject) => {
    child.on("error", (error) => {
      failure = error;
      reject(error);
    });
    child.on("close", (code, signal) => {
      closed = true;
      if (activeEncoder === child) activeEncoder = undefined;
      if (code === 0 && !failure) resolve();
      else {
        reject(
          failure ??
            new Error(
              `Streaming ffmpeg exited ${code ?? signal}: ${stderr.trim()}`
            )
        );
      }
    });
  });
  // A capture failure or an early encoder exit may occur before finish awaits
  // completion. Attach a handler immediately while preserving the rejection.
  completion.catch(() => {});
  return {
    async write(buffer) {
      if (interrupted) throw new Error("Rendering interrupted.");
      if (closed || failure) {
        throw (
          failure ?? new Error(`Streaming encoder closed: ${stderr.trim()}`)
        );
      }
      // Await the write callback so large screenshot buffers cannot accumulate
      // in memory while the encoder applies backpressure.
      await new Promise((resolve, reject) => {
        child.stdin.write(buffer, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      if (failure) throw failure;
    },
    async finish() {
      if (!closed && !child.stdin.destroyed) child.stdin.end();
      await completion;
    },
    async abort() {
      if (!closed) {
        child.stdin.destroy();
        child.kill("SIGTERM");
      }
      await completion.catch(() => {});
    },
  };
}

async function setFrame(page, markup) {
  if (interrupted) throw new Error("Rendering interrupted.");
  await page.evaluate(async (svg) => {
    document.getElementById("stage").innerHTML = svg;
    await document.fonts.ready;
    const sources = [...document.querySelectorAll("svg image")]
      .map(
        (image) =>
          image.getAttribute("href") ?? image.getAttribute("xlink:href")
      )
      .filter(Boolean);
    // Keep decoded source bitmaps alive across SVG replacement; otherwise a
    // long 60fps export repeatedly creates and decodes the same Image objects.
    const decodedImages = (window.industryMotionDecodedImages ??= new Map());
    await Promise.all(
      [...new Set(sources)].map((source) => {
        if (!decodedImages.has(source)) {
          const image = new Image();
          image.src = source;
          decodedImages.set(source, { image, ready: image.decode() });
        }
        return decodedImages.get(source).ready;
      })
    );
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
  }, markup);
}

async function main() {
  const options = readArguments(process.argv.slice(2));
  if (options.help) {
    console.log(usage);
    return;
  }
  const renderSettings = {
    ...desktopRenderSettings,
    ...(options.compact ? { width: 1080, height: 936 } : {}),
    fps: options.fps,
    seconds: options.seconds,
  };
  const frameCount = Math.round(renderSettings.fps * renderSettings.seconds);
  await verifyOutput(options.output, ".mp4");
  await verifyOutput(options.poster, ".webp");
  await Promise.all([
    access("/usr/bin/ffmpeg", constants.X_OK),
    access("/usr/bin/ffprobe", constants.X_OK),
  ]);
  const imageInputs = await resolveImageInputs(options);
  const typeface = await loadTypeface(options);
  const component = await loadComponent(
    options.component,
    options.compact,
    options.componentExport
  );
  const firstMarkup = component.render(0, imageInputs);
  component.render(1, imageInputs);
  const manifest = {
    ...renderSettings,
    compact: options.compact,
    streamed: options.stream,
    frames: frameCount,
    timeline: options.timeline,
    loop:
      options.timeline === "continuous"
        ? "continuous phase, no duplicate closing frame"
        : `${(renderSettings.seconds * 3) / 8}s forward, ${renderSettings.seconds / 8}s hold, ${(renderSettings.seconds * 3) / 8}s reverse, ${renderSettings.seconds / 8}s hold`,
    component: options.component,
    componentExport: options.componentExport,
    componentSha256: component.sha256,
    images: imageInputs,
    typeface: {
      family: "Inter",
      sourcePath: typeface.sourcePath,
      sha256: typeface.sha256,
    },
    output: options.output,
    poster: options.poster,
    posterProgress: options.posterProgress,
  };
  if (options.check) {
    console.log(JSON.stringify({ checked: true, ...manifest }, null, 2));
    return;
  }

  const captureDirectory = await mkdtemp(
    path.join(tmpdir(), "kuinbee-industry-motion-")
  );
  let browser;
  let context;
  let streamingEncoder;
  let succeeded = false;
  const interrupt = () => {
    interrupted = true;
    activeEncoder?.kill("SIGTERM");
  };
  process.once("SIGINT", interrupt);
  process.once("SIGTERM", interrupt);
  try {
    await writeFile(
      path.join(captureDirectory, "manifest.json"),
      JSON.stringify(manifest, null, 2)
    );
    const puppeteer = projectRequire(options.puppeteerModule);
    browser = await puppeteer.connect({ browserURL: options.cdpUrl });
    context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setViewport({
      width: renderSettings.width,
      height: renderSettings.height,
      deviceScaleFactor: 1,
    });
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: "light" },
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#fff;color:#202020;color-scheme:light}
      *,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
      #stage{width:100vw;height:100vh}
      #stage>svg{display:block;width:100%;height:100%}
    </style></head><body><div id="stage"></div></body></html>`);
    await page.evaluate(async (dataUrl) => {
      const font = new FontFace("Inter", `url(${dataUrl})`, {
        style: "normal",
        weight: "100 900",
      });
      await font.load();
      document.fonts.add(font);
      await document.fonts.ready;
    }, typeface.dataUrl);
    await setFrame(page, firstMarkup);
    if (options.previewOnly) {
      const previews = [];
      const previewProgresses =
        options.timeline === "continuous" ? [0, 0.25, 0.5, 0.75, 1] : [0.1, 1];
      for (const progress of previewProgresses) {
        const previewPath = path.join(
          captureDirectory,
          `preview-${progress}.png`
        );
        await setFrame(page, component.render(progress, imageInputs));
        await page.screenshot({
          path: previewPath,
          type: "png",
          captureBeyondViewport: false,
        });
        previews.push({ progress, path: previewPath });
      }
      succeeded = true;
      console.log(
        JSON.stringify(
          { previewed: true, previews, captureDirectory, ...manifest },
          null,
          2
        )
      );
      return;
    }
    const stagedVideo = path.join(captureDirectory, "video.mp4");
    const stagedPoster = path.join(captureDirectory, "poster.webp");
    if (options.stream) {
      streamingEncoder = createStreamingEncoder(
        videoEncoderArguments(
          [
            "-f",
            "image2pipe",
            "-vcodec",
            "png",
            "-framerate",
            String(renderSettings.fps),
            "-i",
            "pipe:0",
          ],
          frameCount,
          stagedVideo
        )
      );
    }
    let previousMarkup;
    let previousBuffer;
    let capturedFrames = 0;
    for (let frame = 0; frame < frameCount; frame++) {
      const markup = component.render(
        progressAtFrame(frame, renderSettings, options.timeline),
        imageInputs
      );
      if (options.stream) {
        // Held poses are genuinely identical rendered geometry, not dropped
        // animation frames. Reuse only the immediately preceding PNG buffer.
        if (markup !== previousMarkup || !previousBuffer) {
          await setFrame(page, markup);
          previousBuffer = await page.screenshot({
            type: "png",
            captureBeyondViewport: false,
          });
          previousMarkup = markup;
          capturedFrames++;
        }
        await streamingEncoder.write(previousBuffer);
      } else {
        await setFrame(page, markup);
        await page.screenshot({
          path: path.join(
            captureDirectory,
            `frame-${String(frame).padStart(6, "0")}.png`
          ),
          type: "png",
          captureBeyondViewport: false,
        });
        capturedFrames++;
      }
      if (frame % renderSettings.fps === 0) {
        console.log(
          JSON.stringify({
            rendering: true,
            frame,
            frames: frameCount,
            capturedFrames,
            progress: progressAtFrame(frame, renderSettings, options.timeline),
            captureDirectory,
          })
        );
      }
    }
    if (streamingEncoder) await streamingEncoder.finish();
    const posterSource = path.join(captureDirectory, "poster-source.png");
    await setFrame(page, component.render(options.posterProgress, imageInputs));
    await page.screenshot({
      path: posterSource,
      type: "png",
      captureBeyondViewport: false,
    });

    if (!options.stream) {
      await runCommand(
        "/usr/bin/ffmpeg",
        videoEncoderArguments(
          [
            "-framerate",
            String(renderSettings.fps),
            "-i",
            path.join(captureDirectory, "frame-%06d.png"),
          ],
          frameCount,
          stagedVideo
        )
      );
    }
    await runCommand("/usr/bin/ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-nostdin",
      "-n",
      "-i",
      posterSource,
      "-frames:v",
      "1",
      "-an",
      "-c:v",
      "libwebp",
      "-quality",
      "92",
      "-compression_level",
      "6",
      stagedPoster,
    ]);
    const probe = JSON.parse(
      await runCommand("/usr/bin/ffprobe", [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-count_frames",
        "-show_entries",
        "stream=codec_name,width,height,avg_frame_rate,nb_read_frames:format=duration",
        "-of",
        "json",
        stagedVideo,
      ])
    );
    const stream = probe.streams?.[0];
    if (
      stream?.codec_name !== "h264" ||
      stream.width !== renderSettings.width ||
      stream.height !== renderSettings.height ||
      stream.avg_frame_rate !== `${renderSettings.fps}/1` ||
      Number(stream.nb_read_frames) !== frameCount ||
      Math.abs(Number(probe.format?.duration) - renderSettings.seconds) > 0.02
    ) {
      throw new Error(
        `Encoded video failed its expected-format checks: ${JSON.stringify(probe)}`
      );
    }
    await verifyOutput(options.output, ".mp4");
    await verifyOutput(options.poster, ".webp");
    await mkdir(path.dirname(options.output), { recursive: true });
    await mkdir(path.dirname(options.poster), { recursive: true });
    await copyFile(stagedVideo, options.output, constants.COPYFILE_EXCL);
    await copyFile(stagedPoster, options.poster, constants.COPYFILE_EXCL);
    succeeded = true;
    console.log(
      JSON.stringify(
        {
          rendered: true,
          capturedFrames,
          ...manifest,
          probe,
          ...(options.keepFrames ? { captureDirectory } : {}),
        },
        null,
        2
      )
    );
  } catch (error) {
    if (streamingEncoder) await streamingEncoder.abort();
    console.error(
      `Private rendering files retained for inspection: ${captureDirectory}`
    );
    throw error;
  } finally {
    process.off("SIGINT", interrupt);
    process.off("SIGTERM", interrupt);
    if (context)
      await context
        .close()
        .catch((error) =>
          console.error(`Could not close exporter context: ${error.message}`)
        );
    browser?.disconnect();
    if (succeeded && !options.keepFrames) {
      const actualDirectory = await realpath(captureDirectory);
      if (
        path.dirname(actualDirectory) !== (await realpath(tmpdir())) ||
        !path.basename(actualDirectory).startsWith("kuinbee-industry-motion-")
      ) {
        throw new Error(
          `Refusing to clean an unexpected temporary directory: ${actualDirectory}`
        );
      }
      await rm(actualDirectory, { recursive: true, force: false });
    }
  }
}

main().catch((error) => {
  console.error(error.stack ?? String(error));
  process.exitCode = 1;
});
