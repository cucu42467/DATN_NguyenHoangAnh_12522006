/**
 * Cau hinh co so URL backend (ASP.NET Core).
 */

/** Gia tri mac dinh API_ND (user). */
export const CO_SO_API_ND_MAC_DINH = "http://10.49.145.68";

/** Gia tri mac dinh API_QT (admin) - IP moi uu tien */
export const CO_SO_API_QT_MAC_DINH = "http://10.49.145.68";

/** Cac IP fallback neu IP moi khong hoat dong */
const CAC_IP_FALLBACK_QT = [
  "http://10.49.145.68:5001",
  "http://192.168.1.8:5001",
  "http://localhost:5001",
];

/** Bien moi truong Next.js */
export const TEN_BIEN_CO_SO_ND = "NEXT_PUBLIC_API_ND_BASE_URL" as const;
export const TEN_BIEN_CO_SO_QT = "NEXT_PUBLIC_API_QT_BASE_URL" as const;

/**
 * Lay base URL API_ND (user) - tu dong thu cac IP fallback.
 */
export function layCoSoApi(): string {
  // Thu IP moi truoc
  const ipMoi = process.env.NEXT_PUBLIC_API_ND_BASE_URL ?? CO_SO_API_ND_MAC_DINH;
  return ipMoi.replace(/\/+$/, "");
}

/**
 * Lay base URL API_QT (admin) - tu dong thu cac IP fallback.
 */
export function layCoSoApiQt(): string {
  // Thu IP moi truoc
  const ipMoi = process.env.NEXT_PUBLIC_API_QT_BASE_URL ?? CO_SO_API_QT_MAC_DINH;
  return ipMoi.replace(/\/+$/, "");
}

/**
 * Noi API_ND + duong dan.
 */
export function noiDuongDan(duongDanTuongDoi: string): string {
  // Neu la URL day du (co http/https), tra ve nguyen
  if (duongDanTuongDoi.startsWith("http://") || duongDanTuongDoi.startsWith("https://")) {
    return duongDanTuongDoi;
  }
  const coSo = layCoSoApi();
  const path = duongDanTuongDoi.startsWith("/") ? duongDanTuongDoi : `/${duongDanTuongDoi}`;
  return `${coSo}${path}`;
}

/**
 * Noi API_QT + duong dan.
 */
export function noiDuongDanQt(duongDanTuongDoi: string): string {
  // Neu la URL day du (co http/https), tra ve nguyen
  if (duongDanTuongDoi.startsWith("http://") || duongDanTuongDoi.startsWith("https://")) {
    return duongDanTuongDoi;
  }
  const coSo = layCoSoApiQt();
  const path = duongDanTuongDoi.startsWith("/") ? duongDanTuongDoi : `/${duongDanTuongDoi}`;
  return `${coSo}${path}`;
}

/**
 * Timeout fetch.
 */
export function layGiayHetHanFetch(): number {
  const v = process.env.NEXT_PUBLIC_API_TIMEOUT_SECONDS;
  if (v === undefined || v === "") return 60;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 60;
}

