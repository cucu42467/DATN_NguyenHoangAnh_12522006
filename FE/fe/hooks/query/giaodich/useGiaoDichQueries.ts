"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  capNhatGiaoDich,
  layChiTietGiaoDich,
  layDanhSachGiaoDich,
  taoGiaoDich,
  xoaGiaoDich,
} from "@/services/giaodich/giaodich";
import { layTongQuan } from "@/services/trangchu/tongquan";
import { queryKeys } from "@/lib/query/query-keys";
import type { GiaoDichDto, LocGiaoDichDto, TaoGiaoDichDto } from "@/types";

const STALE_TIME_LIST = 1000 * 60 * 2; // 2 phút
const STALE_TIME_DETAIL = 1000 * 60 * 5; // 5 phút
const GC_TIME = 1000 * 60 * 30; // 30 phút

export function useDanhSachGiaoDichQuery(filter: LocGiaoDichDto) {
  return useQuery({
    queryKey: queryKeys.giaoDich.list(filter),
    queryFn: () => layDanhSachGiaoDich(filter),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useTongQuanGiaoDichQuery() {
  return useQuery({
    queryKey: queryKeys.giaoDich.tongQuan,
    queryFn: () => layTongQuan(),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME,
  });
}

export function useChiTietGiaoDichQuery(id?: number) {
  return useQuery({
    queryKey: id ? queryKeys.giaoDich.detail(id) : [...queryKeys.giaoDich.detail(0), "disabled"],
    queryFn: () => layChiTietGiaoDich(id as number),
    enabled: typeof id === "number" && Number.isFinite(id),
    staleTime: STALE_TIME_DETAIL,
    gcTime: GC_TIME,
  });
}

export async function prefetchChiTietGiaoDich(
  queryClient: QueryClient,
  id: number
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.giaoDich.detail(id),
    queryFn: () => layChiTietGiaoDich(id),
    staleTime: STALE_TIME_DETAIL,
  });
}

export function useTaoGiaoDichMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: TaoGiaoDichDto & { tepDinhKem?: File }) => taoGiaoDich(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giaoDich.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.giaoDich.tongQuan });
    },
  });
}

export function useCapNhatGiaoDichMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: TaoGiaoDichDto & { tepDinhKem?: File };
    }) => capNhatGiaoDich(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giaoDich.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.giaoDich.tongQuan });
      queryClient.invalidateQueries({
        queryKey: queryKeys.giaoDich.detail(variables.id),
      });
    },
  });
}

export function useXoaGiaoDichMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => xoaGiaoDich(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giaoDich.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.giaoDich.tongQuan });
    },
  });
}
