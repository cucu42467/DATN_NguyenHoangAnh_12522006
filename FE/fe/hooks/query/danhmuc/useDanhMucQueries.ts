"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  capNhatDanhMuc,
  layChiTietDanhMuc,
  layDanhSachDanhMuc,
  layDanhSachLoaiDanhMuc,
  taoDanhMuc,
  xoaDanhMuc,
} from "@/services/danhmuc/danhmuc";
import { queryKeys } from "@/lib/query/query-keys";
import type { TaoDanhMucDto } from "@/types/DanhMuc";

const STALE_TIME_LIST = 1000 * 60 * 5; // 5 phút
const STALE_TIME_DETAIL = 1000 * 60 * 10; // 10 phút
const GC_TIME = 1000 * 60 * 30; // 30 phút

export function useDanhSachDanhMucQuery(loai?: number | "THU" | "CHI", includeChildren = false) {
  return useQuery({
    queryKey: [...queryKeys.danhMuc.list, { loai, includeChildren }] as const,
    queryFn: () => layDanhSachDanhMuc(loai),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME,
  });
}

export function useDanhSachLoaiDanhMucQuery() {
  return useQuery({
    queryKey: [...queryKeys.danhMuc.all, "loai"] as const,
    queryFn: layDanhSachLoaiDanhMuc,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME,
  });
}

export function useChiTietDanhMucQuery(id?: number) {
  return useQuery({
    queryKey: id ? queryKeys.danhMuc.detail(id) : [...queryKeys.danhMuc.detail(0), "disabled"],
    queryFn: () => layChiTietDanhMuc(id as number),
    enabled: typeof id === "number" && Number.isFinite(id),
    staleTime: STALE_TIME_DETAIL,
    gcTime: GC_TIME,
  });
}

export function useTaoDanhMucMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: TaoDanhMucDto) => taoDanhMuc(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.danhMuc.all });
    },
  });
}

export function useCapNhatDanhMucMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: TaoDanhMucDto }) => capNhatDanhMuc(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.danhMuc.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.danhMuc.detail(variables.id) });
    },
  });
}

export function useXoaDanhMucMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => xoaDanhMuc(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.danhMuc.all });
    },
  });
}
