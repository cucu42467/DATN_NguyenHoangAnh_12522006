/**
 * Cau hinh co so URL backend QUAN TRI (API_QT - ASP.NET Core).
 * API_QT chay tai port rieng: https://10.49.145.68:7116
 */

export const CO_SO_ADMIN_API_MAC_DINH = "http://localhost:5001";
export const TEN_BIEN_ADMIN_API = "NEXT_PUBLIC_ADMIN_API_BASE_URL" as const;

/** Lay base URL Admin API (khong co dau / cuoi) */
export function layCoSoAdminApi(): string {
  const raw =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL
      ? process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL
      : CO_SO_ADMIN_API_MAC_DINH;
  return raw.replace(/\/+$/, "");
}

/** Noi co so Admin API voi duong dan tuong doi */
export function noiDuongDanAdmin(duongDanTuongDoi: string): string {
  const coSo = layCoSoAdminApi();
  const path = duongDanTuongDoi.startsWith("/") ? duongDanTuongDoi : `/${duongDanTuongDoi}`;
  return `${coSo}${path}`;
}
