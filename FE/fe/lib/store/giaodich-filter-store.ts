"use client";

import { create } from "zustand";
import type { LocGiaoDichDto } from "@/types";

type GiaoDichFilterState = {
  filter: LocGiaoDichDto;
  setFilter: (partial: Partial<LocGiaoDichDto>) => void;
  setPage: (page: number) => void;
  resetFilter: () => void;
};

const defaultFilter: LocGiaoDichDto = {
  page: 1,
  pageSize: 20,
};

export const useGiaoDichFilterStore = create<GiaoDichFilterState>((set) => ({
  filter: defaultFilter,
  setFilter: (partial) =>
    set((state) => ({
      filter: {
        ...state.filter,
        ...partial,
        page: partial.page ?? 1,
      },
    })),
  setPage: (page) =>
    set((state) => ({
      filter: {
        ...state.filter,
        page,
      },
    })),
  resetFilter: () => set({ filter: defaultFilter }),
}));
