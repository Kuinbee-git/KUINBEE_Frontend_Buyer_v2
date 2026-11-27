// Original bearing-mount demonstration. Geometry uses millimetres.
type Point = readonly [number, number, number];
type Material = readonly [number, number, number];
type Profile = readonly (readonly [distance: number, radius: number])[];

export const boreDiameter = 42;
export const boltSpacing = 86;
const centreHeight = 53;

export const bearingParts = {
  base: {
    name: "Base plate",
    purpose: "Anchors the mount to a frame.",
    colour: "#7793b1",
    movement: [0, 0, -11],
    labelAt: [52, -26, 7],
  },
  housing: {
    name: "Housing",
    purpose: "Aligns the bushing and shaft.",
    colour: "#aebed3",
    movement: [0, 0, 13],
    labelAt: [28, 1, 73],
  },
  bushing: {
    name: "Bronze bushing",
    purpose: "Provides the Ø42 mm bore.",
    colour: "#f2ba71",
    movement: [0, -52, 13],
    labelAt: [-13, -31, 69],
  },
  seal: {
    name: "Front seal",
    purpose: "Keeps debris out of the bore.",
    colour: "#91abbe",
    movement: [0, -108, 13],
    labelAt: [-14, -35, 70],
  },
  retainer: {
    name: "Rear retainer",
    purpose: "Retains the bushing at the rear.",
    colour: "#cdd7e1",
    movement: [0, 57, 13],
    labelAt: [15, 24, 70],
  },
  bolts: {
    name: "Socket bolts ×2",
    purpose: "Clamp the housing to the base.",
    colour: "#bacbdc",
    movement: [0, 0, 59],
    labelAt: [43, 0, 26],
  },
  washers: {
    name: "Washers ×2",
    purpose: "Spread the load under each bolt.",
    colour: "#a1b6ca",
    movement: [0, 0, 34],
    labelAt: [43, 0, 19],
  },
  fitting: {
    name: "Grease fitting",
    purpose: "Feeds lubricant to the bushing.",
    colour: "#f2d38c",
    movement: [0, 0, 34],
    labelAt: [0, 0, 104],
  },
} as const satisfies Record<
  string,
  {
    name: string;
    purpose: string;
    colour: string;
    movement: Point;
    labelAt: Point;
  }
>;

export type BearingPart = keyof typeof bearingParts;

type Face = {
  vertices: Point[];
  normal: Point;
  material: Material;
  part: BearingPart;
  edge: boolean;
};

const graphite: Material = [119, 143, 169];
const steel: Material = [185, 205, 222];
const bronze: Material = [222, 163, 95];
const seal: Material = [77, 92, 108];
const hardware: Material = [166, 188, 205];
const inset: Material = [51, 70, 91];
const brass: Material = [219, 189, 116];

const faces: Face[] = [];
const dot = (a: Point, b: Point) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function addFace(
  vertices: Point[],
  material: Material,
  part: BearingPart,
  edge = false
) {
  const [a, b, c] = vertices;
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const cross: Point = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];
  const length = Math.hypot(...cross);
  if (length < 0.001) return;
  faces.push({
    vertices,
    normal: [cross[0] / length, cross[1] / length, cross[2] / length],
    material,
    part,
    edge,
  });
}

function plate(
  x: number,
  y: number,
  lower: number,
  upper: number,
  bevel: number,
  material: Material,
  part: BearingPart
) {
  const corner = 5;
  function ring(z: number, inset: number): Point[] {
    const w = x - inset;
    const d = y - inset;
    return [
      [-w + corner, -d, z],
      [w - corner, -d, z],
      [w, -d + corner, z],
      [w, d - corner, z],
      [w - corner, d, z],
      [-w + corner, d, z],
      [-w, d - corner, z],
      [-w, -d + corner, z],
    ];
  }
  const rings = [
    ring(lower, bevel),
    ring(lower + bevel, 0),
    ring(upper - bevel, 0),
    ring(upper, bevel),
  ];
  addFace([...rings[0]].reverse(), material, part);
  addFace(rings[3], material, part);
  for (let i = 0; i < rings.length - 1; i++) {
    for (let j = 0; j < 8; j++) {
      const next = (j + 1) % 8;
      addFace(
        [rings[i][j], rings[i][next], rings[i + 1][next], rings[i + 1][j]],
        material,
        part,
        true
      );
    }
  }
}

// Revolve the cross-section. By convention, each profile runs front-to-back along its outside edge.
function turn(
  origin: Point,
  axis: "bore" | "vertical",
  profile: Profile,
  material: Material,
  part: BearingPart,
  segments = 64,
  darkSegments: readonly number[] = []
) {
  const rings = profile.map(([along, radius]) =>
    Array.from({ length: segments }, (_, index): Point => {
      const angle = (index * 2 * Math.PI) / segments;
      const x = origin[0] + radius * Math.cos(angle);
      const offset = radius * Math.sin(angle);
      return axis === "bore"
        ? [x, origin[1] + along, origin[2] + offset]
        : [x, origin[1] - offset, origin[2] + along];
    })
  );
  for (let row = 0; row < rings.length; row++) {
    const before = rings[row];
    const after = rings[(row + 1) % rings.length];
    const surface = darkSegments.includes(row) ? inset : material;
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      addFace(
        profile[(row + 1) % rings.length][1] === 0
          ? [before[i], after[i], before[next]]
          : [before[i], after[i], after[next], before[next]],
        surface,
        part
      );
    }
  }
}

const axis: Point = [0, 0, centreHeight];
const boreRadius = boreDiameter / 2;

plate(73, 37, 0, 9, 1.6, graphite, "base");
for (const x of [-59, 59]) {
  for (const y of [-24, 24]) {
    turn(
      [x, y, 0],
      "vertical",
      [
        [9.03, 0],
        [9.03, 5.4],
        [9.72, 4.75],
        [9.72, 3.75],
        [9.09, 3.55],
        [9.09, 0],
      ],
      hardware,
      "base",
      32,
      [3, 4]
    );
  }
}
plate(56, 25, 9, 19, 1.4, graphite, "housing");
plate(30, 18, 19, 25, 1.1, graphite, "housing");

turn(
  axis,
  "bore",
  [
    [-20, 32],
    [-17, 36],
    [-12, 36],
    [-11.3, 35.25],
    [-10, 35.25],
    [-9.3, 36],
    [12, 36],
    [12.6, 35.25],
    [13.8, 35.25],
    [14.4, 36],
    [16, 36],
    [20, 32],
    [20, 28],
    [18, 26.6],
    [-18, 26.6],
    [-20, 28],
  ],
  steel,
  "housing",
  96
);

turn(
  axis,
  "bore",
  [
    [-27, 27.5],
    [-25.8, 29],
    [-23, 29],
    [-21.5, 26.55],
    [-13, 26.55],
    [-12.4, 25.7],
    [-10.7, 25.7],
    [-10, 26.55],
    [16, 26.55],
    [18, 25.6],
    [18, boreRadius + 1],
    [16.5, boreRadius],
    [-25.5, boreRadius],
    [-27, boreRadius + 1.2],
  ],
  bronze,
  "bushing",
  80
);

turn(
  axis,
  "bore",
  [
    [-33, 23.6],
    [-32, 25.1],
    [-31.2, 25.8],
    [-30.35, 25.8],
    [-30.1, 25.25],
    [-29.7, 25.25],
    [-29.45, 25.8],
    [-28.6, 25.8],
    [-27, 24.2],
    [-27, boreRadius],
    [-32, boreRadius],
    [-33, boreRadius + 0.8],
  ],
  seal,
  "seal",
  72
);

turn(
  axis,
  "bore",
  [
    [20, 27.2],
    [22, 30],
    [26, 30],
    [28.2, 27.6],
    [28.2, 23],
    [26, boreRadius],
    [22, boreRadius],
    [20, 23],
  ],
  hardware,
  "retainer",
  72
);

for (const x of [-boltSpacing / 2, boltSpacing / 2]) {
  const post: Point = [x, 0, 0];
  turn(
    post,
    "vertical",
    [
      [19, 5.05],
      [19, 8.5],
      [19.6, 9],
      [20.8, 9],
      [21.4, 8.4],
      [21.4, 5.05],
    ],
    hardware,
    "washers",
    48
  );
  turn(
    post,
    "vertical",
    [
      [8, 0],
      [8, 4],
      [9, 4.85],
      [21.4, 4.85],
      [21.4, 7.4],
      [22.1, 8],
      [27.2, 8],
      [28.1, 7.1],
      [28.1, 4],
      [25.3, 4],
      [25.3, 0],
    ],
    steel,
    "bolts",
    12,
    [8, 9]
  );
}

// The fitting sits on the housing crown and lifts clear in the exploded view.
turn(
  [0, 0, centreHeight + 36],
  "vertical",
  [
    [-1, 0],
    [-1, 4.3],
    [0, 6],
    [4.5, 6],
    [5.5, 3.9],
    [9, 3.9],
    [10.2, 5],
    [12.6, 4.8],
    [14, 2.4],
    [14, 0],
  ],
  brass,
  "fitting",
  24,
  [8]
);

export type BearingCamera = {
  azimuth: number;
  elevation: number;
};

export const initialBearingCamera: BearingCamera = {
  azimuth: 0.67,
  elevation: 0.4,
};
const light: Point = [-0.33, -0.49, 0.81];
const parts = Object.keys(bearingParts) as BearingPart[];
const partExtents = parts.map((part) => {
  const pts = faces
    .filter((face) => face.part === part)
    .flatMap((face) => face.vertices);
  const lo = [0, 1, 2].map((axis) =>
    Math.min(...pts.map((point) => point[axis]))
  );
  const hi = [0, 1, 2].map((axis) =>
    Math.max(...pts.map((point) => point[axis]))
  );
  const corners: Point[] = [];
  for (const x of [lo[0], hi[0]]) {
    for (const y of [lo[1], hi[1]]) {
      for (const z of [lo[2], hi[2]]) corners.push([x, y, z]);
    }
  }
  return { part, corners };
});

function projection({ azimuth, elevation }: BearingCamera) {
  const sinA = Math.sin(azimuth),
    cosA = Math.cos(azimuth);
  const sinE = Math.sin(elevation),
    cosE = Math.cos(elevation);
  const right: Point = [cosA, sinA, 0];
  const viewer: Point = [sinA * cosE, -cosA * cosE, sinE];
  const up: Point = [-sinA * sinE, cosA * sinE, cosE];
  const project = (point: Point): Point => [
    dot(point, right),
    -dot(point, up),
    dot(point, viewer),
  ];
  return { project, viewer };
}

function colour(material: Material, lightness: number) {
  return `rgb(${material.map((channel) => Math.min(255, Math.round(channel * lightness))).join(",")})`;
}

// Slider-only updates reuse the projected geometry. An orbit prepares a new projection.
const projections = new WeakMap<
  CanvasRenderingContext2D,
  {
    azimuth: number;
    elevation: number;
    scene: ReturnType<typeof prepareScene>;
  }
>();
const textures = new WeakMap<CanvasRenderingContext2D, CanvasPattern>();

// A subtle repeating directional grain gives the shaded surfaces a machined finish.
function grain(context: CanvasRenderingContext2D) {
  const cached = textures.get(context);
  if (cached) return cached;
  const tile = document.createElement("canvas");
  tile.width = 192;
  tile.height = 128;
  const painter = tile.getContext("2d");
  if (!painter) return null;
  const pixels = painter.createImageData(tile.width, tile.height);
  let seed = 39271;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let y = 0; y < tile.height; y++) {
    const streak = (random() - 0.5) * 16;
    for (let x = 0; x < tile.width; x++) {
      const point = (y * tile.width + x) * 4;
      const amount = streak + (random() - 0.5) * 11;
      pixels.data[point] =
        pixels.data[point + 1] =
        pixels.data[point + 2] =
          amount > 0 ? 255 : 0;
      pixels.data[point + 3] = Math.abs(amount);
    }
  }
  painter.putImageData(pixels, 0, 0);
  const pattern = context.createPattern(tile, "repeat");
  if (pattern) textures.set(context, pattern);
  return pattern;
}

function prepareScene(camera: BearingCamera) {
  const { project, viewer } = projection(camera);
  const offsets = Object.fromEntries(
    parts.map((part) => [part, project(bearingParts[part].movement)])
  ) as Record<BearingPart, Point>;
  const bounds = partExtents.map(({ part, corners }) => {
    const points = corners.map(project);
    return {
      part,
      x0: Math.min(...points.map(([x]) => x)),
      x1: Math.max(...points.map(([x]) => x)),
      y0: Math.min(...points.map(([, y]) => y)),
      y1: Math.max(...points.map(([, y]) => y)),
    };
  });
  const halfLength = Math.hypot(
    light[0] + viewer[0],
    light[1] + viewer[1],
    light[2] + viewer[2]
  );
  const reflection: Point = [
    (light[0] + viewer[0]) / halfLength,
    (light[1] + viewer[1]) / halfLength,
    (light[2] + viewer[2]) / halfLength,
  ];
  const drawables = faces
    .filter((face) => dot(face.normal, viewer) > 0.002)
    .map((face) => {
      const path = new Path2D();
      let depth = 0;
      face.vertices.forEach((vertex, index) => {
        const [x, y, z] = project(vertex);
        if (index === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
        depth += z;
      });
      path.closePath();
      const metallic = face.part !== "seal" && face.material !== inset;
      const reflectionAmount = Math.max(0, dot(face.normal, reflection));
      const sheen = metallic ? 0.3 * reflectionAmount ** 24 : 0;
      const shade = Math.max(
        0.44,
        0.72 + 0.34 * dot(face.normal, light) + sheen
      );
      return {
        path,
        depth: depth / face.vertices.length,
        weight: 0,
        colour: colour(face.material, shade),
        dim: colour(face.material, shade * 0.62),
        edge: face.edge ? colour(face.material, shade * 0.88) : null,
        part: face.part,
      };
    });
  return { project, offsets, bounds, drawables };
}

function drawCallout(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  x: number,
  y: number,
  part: BearingPart,
  label: string = bearingParts[part].name
) {
  const size = width < 500 ? 11 : 13;
  context.font = `550 ${size}px system-ui, sans-serif`;
  const bubbleWidth = context.measureText(label).width + 20;
  const left = Math.min(
    width - bubbleWidth - 5,
    Math.max(5, x - bubbleWidth / 2)
  );
  const top = Math.max(7, Math.min(height - 49, y - 34));

  context.strokeStyle = bearingParts[part].colour;
  context.fillStyle = bearingParts[part].colour;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(
    Math.min(left + bubbleWidth - 7, Math.max(left + 7, x)),
    top + 23
  );
  context.stroke();
  context.beginPath();
  context.arc(x, y, 2.5, 0, 2 * Math.PI);
  context.fill();

  context.fillStyle = "#122035";
  context.beginPath();
  context.roundRect(left, top, bubbleWidth, 23, 4);
  context.fill();
  context.stroke();
  context.fillStyle = "#f1f5fb";
  context.textBaseline = "middle";
  context.fillText(label, left + 10, top + 11.5);
}

export function drawBearing(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  separation: number,
  selected: BearingPart | null = null,
  checkBore = false,
  camera = initialBearingCamera,
  inspectBore = 0,
  checkMount = false
) {
  let cached = projections.get(context);
  if (
    !cached ||
    cached.azimuth !== camera.azimuth ||
    cached.elevation !== camera.elevation
  ) {
    cached = { ...camera, scene: prepareScene(camera) };
    projections.set(context, cached);
  }
  const { project, offsets, bounds, drawables } = cached.scene;
  const positions = { ...offsets };
  for (const part of parts) {
    const [dx, dy, dz] = offsets[part];
    // Move the sleeve off the bore axis during measurement so the seal cannot cover it.
    const detail =
      part === "bushing"
        ? project([-54 * inspectBore, 0, 12 * inspectBore])
        : [0, 0, 0];
    positions[part] = [
      dx * separation + detail[0],
      dy * separation + detail[1],
      dz * separation + detail[2],
    ];
  }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const { x0, x1, y0, y1, part } of bounds) {
    const [px, py] = positions[part];
    minX = Math.min(minX, x0 + px);
    maxX = Math.max(maxX, x1 + px);
    minY = Math.min(minY, y0 + py);
    maxY = Math.max(maxY, y1 + py);
  }
  const scale = Math.min(
    (width * 0.94) / (maxX - minX),
    (height * 0.86) / (maxY - minY)
  );
  const x = width * 0.5 - (minX + maxX) * scale * 0.5;
  const y = height * 0.5 - (minY + maxY) * scale * 0.5;

  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(x, y + offsets.base[1] * scale * separation);
  context.scale(scale, scale * 0.24);
  const shadow = context.createRadialGradient(0, 0, 0, 0, 0, 83);
  shadow.addColorStop(0, "rgba(4,11,25,.56)");
  shadow.addColorStop(1, "rgba(4,11,25,0)");
  context.fillStyle = shadow;
  context.fillRect(-83, -83, 166, 166);
  context.restore();
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);

  if (separation > 0.18) {
    const first = project([
      0,
      -33 - 108 * separation,
      centreHeight + 13 * separation,
    ]);
    const last = project([
      0,
      27 + 57 * separation,
      centreHeight + 13 * separation,
    ]);
    context.beginPath();
    context.moveTo(first[0], first[1]);
    context.lineTo(last[0], last[1]);
    context.lineWidth = 0.75 / scale;
    context.strokeStyle = "rgba(248, 201, 143, .62)";
    context.setLineDash([3, 3]);
    context.stroke();
    context.setLineDash([]);
  }

  for (const face of drawables)
    face.weight = face.depth + positions[face.part][2];
  drawables.sort((a, b) => a.weight - b.weight);

  for (const face of drawables) {
    const dimmed = selected && face.part !== selected;
    const fill = dimmed ? face.dim : face.colour;
    context.save();
    context.translate(positions[face.part][0], positions[face.part][1]);
    context.fillStyle = fill;
    context.strokeStyle = dimmed ? fill : (face.edge ?? fill);
    context.lineWidth = 0.7 / scale;
    context.fill(face.path);
    context.stroke(face.path);
    context.restore();
  }
  context.restore();

  const surface = grain(context);
  if (surface) {
    context.save();
    context.globalCompositeOperation = "source-atop";
    context.fillStyle = surface;
    context.fillRect(0, 0, width, height);
    context.restore();
  }

  if (checkBore || checkMount) {
    const part = checkBore ? "bushing" : "bolts";
    const radius = checkBore ? boreRadius : boltSpacing / 2;
    const ordinate = checkBore ? -25.5 : 0;
    const level = checkBore ? centreHeight : 28.1;
    const [px, py] = positions[part];
    const position = (edge: number): Point => {
      const loc = project([edge, ordinate, level]);
      return [loc[0] + px, loc[1] + py, loc[2]];
    };
    const start = position(-radius);
    const end = position(radius);
    const middle = position(0);
    context.save();
    context.strokeStyle = "#ffe1ae";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x + start[0] * scale, y + start[1] * scale);
    context.lineTo(x + end[0] * scale, y + end[1] * scale);
    for (const point of [start, end]) {
      const px = x + point[0] * scale;
      const py = y + point[1] * scale;
      context.moveTo(px, py - 4);
      context.lineTo(px, py + 4);
    }
    context.stroke();
    context.restore();
    drawCallout(
      context,
      width,
      height,
      x + middle[0] * scale,
      y + middle[1] * scale,
      part,
      checkBore ? `Ø${boreDiameter} mm bore` : `${boltSpacing} mm bolt centres`
    );
    return;
  }
  if (selected) {
    const [px, py] = project(bearingParts[selected].labelAt);
    drawCallout(
      context,
      width,
      height,
      x + (px + positions[selected][0]) * scale,
      y + (py + positions[selected][1]) * scale,
      selected
    );
  }
}
