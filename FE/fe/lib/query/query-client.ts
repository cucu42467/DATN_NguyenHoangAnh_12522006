import { QueryClient } from "@tanstack/react-query";

export function taoQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // 2 phút: dữ liệu còn fresh, back không refetch ngay
        gcTime: 1000 * 60 * 30, // 30 phút giữ cache trong memory
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
