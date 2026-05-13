import { layCoSoApi, layGiayHetHanFetch, noiDuongDan } from "./co_so_api";
import { layAccessToken, layRefreshToken, luuPhienDangNhap, xoaPhienDangNhap } from "./luu_tru_phien";
import { lamMoiToken } from "./xacthuc";
import type { PhanHoiLoiApi } from "./kieu_giao_tiep";

const AUTH_ERROR_EVENT = 'auth-error';

// Global flag to prevent multiple simultaneous token refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function dispatchAuthError() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_ERROR_EVENT));
  }
}

export class loiApi extends Error {
  readonly status: number;
  readonly duLieu?: unknown;

  constructor(message: string, status: number, duLieu?: unknown) {
    super(message);
    this.name = "LoiApi";
    this.status = status;
    this.duLieu = duLieu;
  }
}

export type PhuongThucHttp = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type TuyChonGoiApi = {
  method?: PhuongThucHttp;
  body?: unknown;
  headers?: HeadersInit;
  /**
   * true (mac dinh): neu co accessToken trong localStorage thi gan Authorization Bearer.
   * false: dung cho dang nhap / endpoint cong khai.
   */
  tuDongTuyenToken?: boolean;
  /** So giay; 0 = khong timeout. Mac dinh lay tu NEXT_PUBLIC_API_TIMEOUT_SECONDS hoac 60. */
  giayHetHan?: number;
};

function docThongDiepLoi(data: unknown, status: number): string {
  if (typeof data === "object" && data !== null) {
    const o = data as PhanHoiLoiApi;
    if (typeof o.thongDiep === "string" && o.thongDiep.trim()) return o.thongDiep;
    if (typeof o.title === "string" && o.title.trim()) return o.title;
  }
  if (typeof data === "string" && data.trim()) return data;
  return `Loi HTTP ${status}`;
}

// Helper function to check if token is expired
function laTokenHetHan(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    // Consider token expired if it expires within next 30 seconds
    return exp - now < 30000;
  } catch {
    return true; // Invalid token format, consider expired
  }
}

/**
 * Refresh token with global lock to prevent multiple simultaneous refresh attempts
 */
async function refreshTokenWithLock(): Promise<string | null> {
  // If already refreshing, wait for the existing promise
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
      // Refresh failed, clear session
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
  throw new loiApi("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401);
}

/**
 * Goi API backend: noi URL, optional Bearer, parse JSON, nem loiApi khi !ok.
 */
export async function goiApi<T>(duongDanTuongDoi: string, tuyChon: TuyChonGoiApi = {}): Promise<T> {
  const {
    method = "GET",
    body,
    headers: headersNgoai,
    tuDongTuyenToken = true,
    giayHetHan,
  } = tuyChon;

  const url = noiDuongDan(duongDanTuongDoi);
  let headers = new Headers(headersNgoai);

  if (body !== undefined && body !== null && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Handle token - only set if not already set
  let token = layAccessToken();
  
  if (tuDongTuyenToken && token && !headers.has("Authorization")) {
    // Proactively refresh if token is about to expire (only on first API call when isRefreshing)
    if (laTokenHetHan(token) && !isRefreshing) {
      const newToken = await refreshTokenWithLock();
      if (newToken) {
        token = newToken;
      } else {
        // Refresh failed, let the request fail with 401
        handleAuthError();
      }
    }
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const macDinhGiay = layGiayHetHanFetch();
  const giay = giayHetHan !== undefined ? giayHetHan : macDinhGiay;
  const signal =
    giay > 0 && typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
      ? AbortSignal.timeout(giay * 1000)
      : undefined;

  let res = await fetch(url, {
    method,
    headers,
    body: body === undefined || body === null 
      ? undefined 
      : (body instanceof FormData ? body : JSON.stringify(body)),
    signal,
  });

  // If 401, try to refresh token once
  if (res.status === 401 && tuDongTuyenToken && !isRefreshing) {
    const newToken = await refreshTokenWithLock();
    
    if (newToken) {
      // Retry with new token
      const newHeaders = new Headers(headersNgoai);
      if (body !== undefined && body !== null && !newHeaders.has("Content-Type")) {
        newHeaders.set("Content-Type", "application/json");
      }
      newHeaders.set("Authorization", `Bearer ${newToken}`);
      
      res = await fetch(url, {
        method,
        headers: newHeaders,
        body: body === undefined || body === null 
          ? undefined 
          : (body instanceof FormData ? body : JSON.stringify(body)),
        signal,
      });
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
    // 401: Token hết hạn hoặc không hợp lệ → Logout
    if (res.status === 401) {
      handleAuthError();
    }

    // 403: Forbidden - User không có quyền (token còn hợp lệ)
    if (res.status === 403) {
      throw new loiApi("Bạn không có quyền truy cập dữ liệu này.", 403);
    }

    // Các lỗi khác (400, 404, 500, ...)
    throw new loiApi(docThongDiepLoi(data, res.status), res.status, data);
  }

  return data as T;
}

/**
 * GET co Bearer mac dinh.
 */
export function goiApiGet<T>(duongDan: string, tuyChon?: Omit<TuyChonGoiApi, "method" | "body">) {
  return goiApi<T>(duongDan, { ...tuyChon, method: "GET" });
}

export function goiApiPost<T>(duongDan: string, body?: unknown, tuyChon?: Omit<TuyChonGoiApi, "method" | "body">) {
  return goiApi<T>(duongDan, { ...tuyChon, method: "POST", body });
}

export function goiApiPut<T>(duongDan: string, body?: unknown, tuyChon?: Omit<TuyChonGoiApi, "method" | "body">) {
  return goiApi<T>(duongDan, { ...tuyChon, method: "PUT", body });
}

export function goiApiPatch<T>(duongDan: string, body?: unknown, tuyChon?: Omit<TuyChonGoiApi, "method" | "body">) {
  return goiApi<T>(duongDan, { ...tuyChon, method: "PATCH", body });
}

export function goiApiDelete<T>(duongDan: string, tuyChon?: Omit<TuyChonGoiApi, "method" | "body">) {
  return goiApi<T>(duongDan, { ...tuyChon, method: "DELETE" });
}

/** Base URL hien tai (tien ich debug / hien thi) */
export function layUrlDayDu(duongDanTuongDoi: string): string {
  return noiDuongDan(duongDanTuongDoi);
}
