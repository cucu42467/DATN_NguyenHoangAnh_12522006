import { layGiayHetHanFetch, noiDuongDanQt } from "../../thu_vien/co_so_api";
import { layAccessToken, layRefreshToken, luuPhienDangNhap, xoaPhienDangNhap } from "../../thu_vien/luu_tru_phien";
import { lamMoiToken } from "../../thu_vien/xacthuc";
import type { PhanHoiLoiApi } from '../../thu_vien/kieu_giao_tiep';

const AUTH_ERROR_EVENT = 'auth-error-qt';

// Global lock to prevent multiple simultaneous token refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function dispatchAuthError() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_ERROR_EVENT));
  }
}

export class loiApiQt extends Error {
  readonly status: number;
  readonly duLieu?: unknown;

  constructor(message: string, status: number, duLieu?: unknown) {
    super(message);
    this.name = "LoiApiQt";
    this.status = status;
    this.duLieu = duLieu;
  }
}

export type PhuongThucHttp = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type TuyChonGoiApiQt = {
  method?: PhuongThucHttp;
  body?: unknown;
  headers?: HeadersInit;
  tuDongTuyenToken?: boolean;
  giayHetHan?: number;
};

function docThongDiepLoi(data: unknown, status: number): string {
  if (typeof data === "object" && data !== null) {
    const o = data as PhanHoiLoiApi;
    if (typeof o.thongDiep === "string" && o.thongDiep.trim()) return o.thongDiep;
    if (typeof o.title === "string" && o.title.trim()) return o.title;
  }
  if (typeof data === "string" && data.trim()) return data;
  return `Lỗi HTTP ${status}`;
}

function laTokenHetHan(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    return exp - now < 30000;
  } catch {
    return true;
  }
}

/**
 * Refresh token with global lock to prevent multiple simultaneous refresh attempts
 */
async function refreshTokenWithLock(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  
  refreshPromise = (async () => {
    try {
      const refreshToken = layRefreshToken();
      if (!refreshToken) {
        return null;
      }
      
      const result = await lamMoiToken(refreshToken);
      luuPhienDangNhap(result);
      return result.accessToken;
    } catch (error) {
      xoaPhienDangNhap();
      dispatchAuthError();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Handle 401 response - dispatch auth error and return null
 */
function handleAuthError(): never {
  xoaPhienDangNhap();
  dispatchAuthError();
  throw new loiApiQt("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401);
}

export async function goiApiQt<T>(duongDanTuongDoi: string, tuyChon: TuyChonGoiApiQt = {}): Promise<T> {
  const {
    method = "GET",
    body,
    headers: headersNgoai,
    tuDongTuyenToken = true,
    giayHetHan,
  } = tuyChon;

  const url = noiDuongDanQt(duongDanTuongDoi);
  let headers = new Headers(headersNgoai);

  if (body !== undefined && body !== null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let token = layAccessToken();
  
  if (tuDongTuyenToken && token && !headers.has("Authorization")) {
    if (laTokenHetHan(token) && !isRefreshing) {
      const newToken = await refreshTokenWithLock();
      if (newToken) {
        token = newToken;
      } else {
        handleAuthError();
      }
    }
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const macDinhGiay = layGiayHetHanFetch();
  const giay = giayHetHan !== undefined ? giayHetHan : macDinhGiay;
  const signal = giay > 0 ? AbortSignal.timeout(giay * 1000) : undefined;

  let res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  // If 401, try to refresh token once
  if (res.status === 401 && tuDongTuyenToken && !isRefreshing) {
    const newToken = await refreshTokenWithLock();
    
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined, signal });
    }
  }

  let text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { thongDiep: text };
    }
  }

  if (!res.ok) {
    if (res.status === 401) handleAuthError();
    throw new loiApiQt(docThongDiepLoi(data, res.status), res.status, data);
  }

  return data as T;
}

export const goiApiGetQt = <T>(duongDan: string, tuyChon?: Omit<TuyChonGoiApiQt, "method" | "body">) => 
  goiApiQt<T>(duongDan, { ...tuyChon, method: "GET" });

export const goiApiPostQt = <T>(duongDan: string, body?: unknown, tuyChon?: Omit<TuyChonGoiApiQt, "method" | "body">) => 
  goiApiQt<T>(duongDan, { ...tuyChon, method: "POST", body });

export const goiApiPutQt = <T>(duongDan: string, body?: unknown, tuyChon?: Omit<TuyChonGoiApiQt, "method" | "body">) => 
  goiApiQt<T>(duongDan, { ...tuyChon, method: "PUT", body });

export const goiApiDeleteQt = <T>(duongDan: string, tuyChon?: Omit<TuyChonGoiApiQt, "method" | "body">) => 
  goiApiQt<T>(duongDan, { ...tuyChon, method: "DELETE" });

// ============ ALIASES FOR ADMIN (backward compatibility) ============
// Admin services sử dụng cùng API endpoint với QT
export const goiAdminGet = goiApiGetQt;
export const goiAdminPost = goiApiPostQt;
export const goiAdminPut = goiApiPutQt;
export const goiAdminDelete = goiApiDeleteQt;
export class loiAdminApi extends loiApiQt {} // Alias for type compatibility
