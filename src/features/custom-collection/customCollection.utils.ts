export const COLLECTION_METHODS = [
  "SURVEYS",
  "INTERVIEWS",
  "FOCUS_GROUPS",
  "FIELD_OBSERVATION",
  "WEB_SCRAPING",
  "API_INTEGRATION",
  "SENSOR_IOT",
  "IMAGE_VIDEO_CAPTURE",
  "AUDIO_COLLECTION",
  "DOCUMENT_DIGITIZATION",
  "CROWDSOURCING",
  "TRANSACTIONAL_INTEGRATION",
];
export const INDUSTRIES = [
  "HEALTHCARE",
  "FINANCE",
  "RETAIL",
  "TECHNOLOGY",
  "EDUCATION",
  "GOVERNMENT",
  "REAL_ESTATE",
  "AGRICULTURE",
  "MANUFACTURING",
  "MEDIA",
  "ENERGY",
  "TRANSPORT_LOGISTICS",
  "RESEARCH",
];
export const GEOGRAPHIES = [
  "INDIA",
  "SOUTH_ASIA",
  "ASIA_PACIFIC",
  "MIDDLE_EAST",
  "EUROPE",
  "NORTH_AMERICA",
  "SOUTH_AMERICA",
  "AFRICA",
  "GLOBAL",
];
export const FORMATS = [
  "CSV",
  "JSON",
  "EXCEL",
  "PARQUET",
  "SQL",
  "XML",
  "API",
  "IMAGES",
  "AUDIO",
  "VIDEO",
];
export const LANGUAGES = [
  "ENGLISH",
  "HINDI",
  "MARATHI",
  "BENGALI",
  "TAMIL",
  "TELUGU",
  "GUJARATI",
  "KANNADA",
  "MALAYALAM",
  "PUNJABI",
  "MULTILINGUAL",
];

const SPECIAL_LABELS: Record<string, string> = {
  API: "API delivery",
  SENSOR_IOT: "Sensors and IoT",
  IMAGE_VIDEO_CAPTURE: "Image and video capture",
  TRANSPORT_LOGISTICS: "Transport and logistics",
  ASIA_PACIFIC: "Asia Pacific",
  SOUTH_ASIA: "South Asia",
};

export const optionLabel = (value: string) =>
  SPECIAL_LABELS[value] ??
  value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());

export const withOther = (values: string[], other: string | null) =>
  values.map((value) =>
    value === "OTHER" && other ? other : optionLabel(value)
  );

export const missingFieldLabel = (field: string) =>
  ({
    emailVerified: "verified email",
    firstName: "first name",
    lastName: "last name",
    phone: "phone number",
    organization: "organization",
  })[field] ?? optionLabel(field);

/**
 * The API normally returns a CDN URL. During asset-CDN cutover it can return
 * a storage key instead; resolve that key from the public frontend root.
 */
export const customCollectionCoverUrl = (url: string) =>
  /^(https?:)?\/\//.test(url) || url.startsWith("/") ? url : `/${url}`;
