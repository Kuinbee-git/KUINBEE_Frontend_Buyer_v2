import { API_BASE_URL } from "@/core/api/endpoints";
import {
  activeRequirements,
  type RequirementKind,
} from "@/features/active-requirements/active-requirements.data";
import type {
  MarketplaceDataRequirement,
  MarketplaceDataRequirementPage,
} from "@/types/data-requirement.types";

const root = `${API_BASE_URL}/api/v1/marketplace/data-requirements`;
const fallbackPublishedAt = "2026-07-30T00:00:00.000Z";

const fallbackIndustries: Record<RequirementKind, string> = {
  audio: "Audio and Speech",
  image: "Computer Vision",
  video: "Media and Entertainment",
  multimodal: "Cross-industry",
  compliance: "Legal and Compliance",
};

const fallbackRequirements: MarketplaceDataRequirement[] =
  activeRequirements.map((requirement) => ({
    referenceCode: requirement.id,
    slug: requirement.slug,
    title: requirement.title,
    summary: requirement.summary,
    dataType: requirement.type,
    industry: fallbackIndustries[requirement.kind],
    specifications: requirement.specifications,
    coverage: requirement.typeDetails ?? [],
    volume: requirement.volume ?? [],
    deliveryDate: requirement.deliveryDate
      ? new Date(requirement.deliveryDate).toISOString()
      : null,
    publishedAt: fallbackPublishedAt,
  }));

type PublicRequirementError = Error & {
  status?: number;
  code?: string;
};

const unwrap = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.data) {
    const error = new Error(
      payload?.error?.message || "Failed to load data requirements"
    ) as PublicRequirementError;
    error.status = response.status;
    error.code = payload?.error?.code;
    throw error;
  }
  return payload.data;
};

export const listPublicDataRequirements = async (params: {
  page?: number;
  pageSize?: number;
  q?: string;
  sort?: "NEWEST" | "TITLE_ASC" | "TITLE_DESC" | "DELIVERY_DATE";
}): Promise<MarketplaceDataRequirementPage> => {
  const page = params.page || 1;
  const pageSize = params.pageSize || 12;
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("pageSize", String(pageSize));
  if (params.q) query.set("q", params.q);
  if (params.sort) query.set("sort", params.sort);
  try {
    const response = await fetch(`${root}?${query}`, {
      next: { revalidate: 60, tags: ["data-requirements"] },
    });
    return await unwrap(response);
  } catch (caught) {
    const error = caught as PublicRequirementError;
    // The staging backend currently returns a plain Express 404 because this
    // router is not deployed there yet. A structured API 404 must still win.
    if (error.status !== 404 || error.code) throw error;

    const search = params.q?.trim().toLocaleLowerCase();
    const items = search
      ? fallbackRequirements.filter((requirement) =>
          [
            requirement.title,
            requirement.dataType,
            requirement.industry,
            requirement.summary,
          ].some((value) => value.toLocaleLowerCase().includes(search))
        )
      : [...fallbackRequirements];

    if (params.sort === "TITLE_ASC") {
      items.sort((left, right) => left.title.localeCompare(right.title));
    } else if (params.sort === "TITLE_DESC") {
      items.sort((left, right) => right.title.localeCompare(left.title));
    } else if (params.sort === "DELIVERY_DATE") {
      items.sort((left, right) => {
        if (!left.deliveryDate) return 1;
        if (!right.deliveryDate) return -1;
        return left.deliveryDate.localeCompare(right.deliveryDate);
      });
    }

    return {
      items: items.slice((page - 1) * pageSize, page * pageSize),
      page,
      pageSize,
      total: items.length,
    };
  }
};

export const getPublicDataRequirement = async (
  slug: string
): Promise<MarketplaceDataRequirement> => {
  try {
    const response = await fetch(`${root}/${encodeURIComponent(slug)}`, {
      next: {
        revalidate: 60,
        tags: ["data-requirements", `data-requirement:${slug}`],
      },
    });
    return await unwrap(response);
  } catch (caught) {
    const error = caught as PublicRequirementError;
    const fallback = fallbackRequirements.find(
      (requirement) => requirement.slug === slug
    );
    if (error.status === 404 && !error.code && fallback) return fallback;
    throw error;
  }
};
