import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { customCollectionService } from "@/services/custom-collection.service";
import type {
  CustomCollectionListQuery,
  GuestCustomCollectionLeadInput,
} from "@/types/custom-collection.types";

export const customCollectionKeys = {
  all: ["custom-collection-services"] as const,
  list: (query: CustomCollectionListQuery) =>
    ["custom-collection-services", "list", query] as const,
  detail: (slug: string) =>
    ["custom-collection-services", "detail", slug] as const,
};

export const useCustomCollectionServices = (query: CustomCollectionListQuery) =>
  useQuery({
    queryKey: customCollectionKeys.list(query),
    queryFn: () => customCollectionService.list(query),
    placeholderData: keepPreviousData,
  });

export const useCustomCollectionService = (slug: string) =>
  useQuery({
    queryKey: customCollectionKeys.detail(slug),
    queryFn: () => customCollectionService.get(slug),
    retry: false,
  });

export const useGuestCustomCollectionRequest = (slug: string) =>
  useMutation({
    mutationFn: (input: GuestCustomCollectionLeadInput) =>
      customCollectionService.requestAsGuest(slug, input),
  });

export const useOneTapCustomCollectionRequest = (slug: string) =>
  useMutation({
    mutationFn: () => customCollectionService.requestOneTap(slug),
  });
