import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

export interface SuggestionDataset {
  id: string;
  title: string;
  category: string | null;
  slug: string | null;
}

export interface SuggestionService {
  id: string;
  slug: string;
  title: string;
  category: string | null;
}

export interface SearchSuggestionsResult {
  datasets: SuggestionDataset[];
  services: SuggestionService[];
}

export const suggestionKeys = {
  suggestions: (q: string) => ["search-suggestions", q] as const,
};

const normalizeSuggestionQuery = (query: string) =>
  query.trim().replace(/\bx[\s-]?ray\b/gi, "x ray");

export const useSearchSuggestions = (q: string) =>
  useQuery({
    queryKey: suggestionKeys.suggestions(q),
    queryFn: () =>
      apiClient.get<SearchSuggestionsResult>(
        API_ENDPOINTS.MARKETPLACE.SUGGESTIONS,
        { q: normalizeSuggestionQuery(q) }
      ),
    enabled: q.trim().length >= 2,
    staleTime: 30_000,
    gcTime: 60_000,
    retry: false,
  });
