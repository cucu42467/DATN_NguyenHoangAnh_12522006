/**
 * Service upload file lên backend.
 */
import { layCoSoApi, layGiayHetHanFetch } from "../thu_vien/co_so_api";
import { layAccessToken } from "../thu_vien/luu_tru_phien";

export interface KetQuaUpload {
  tenFile: string;
}

function docThongDiepLoi(data: unknown): string {
  if (typeof data === "object" && data !== null) {
    const o = data as { thongDiep?: string };
    if (typeof o.thongDiep === "string") return o.thongDiep;
  }
  if (typeof data === "string") return data;
  return "Upload thất bại";
}

/**
 * Lấy URL đầy đủ của icon từ API backend
 * @param tenFile Tên file icon
 * @returns URL đầy đủ của icon
 */
export function layIconUrl(tenFile: string): string {
  const coSo = layCoSoApi();
  return `${coSo}/api/upload/icon/${encodeURIComponent(tenFile)}`;
}

/**
 * Lấy URL đầy đủ của ảnh mục tiêu từ thư mục Anh
 * @param tenFile Tên file ảnh
 * @returns URL đầy đủ của ảnh
 */
export function layAnhMucTieuUrl(tenFile: string): string {
  const coSo = layCoSoApi();
  return `${coSo}/api/upload/muctieu/${encodeURIComponent(tenFile)}`;
}

/**
 * Upload ảnh hóa đơn/chứng từ vào thư mục Anh.
 * @param file File ảnh cần upload
 * @returns Tên file đã lưu
 */
export async function uploadAnh(file: File): Promise<KetQuaUpload> {
  const coSo = layCoSoApi();
  const url = `${coSo}/api/upload/anh`;
  const token = layAccessToken();

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
    signal: AbortSignal.timeout(layGiayHetHanFetch() * 1000),
  });

  if (!res.ok) {
    let data: unknown = null;
    const text = await res.text();
    try { data = JSON.parse(text); } catch { data = text; }
    throw new Error(docThongDiepLoi(data));
  }

  return res.json() as Promise<KetQuaUpload>;
}

/**
 * Upload icon danh mục vào thư mục ICON (cùng cấp FE).
 * @param file File ảnh/icon cần upload
 * @returns Tên file đã lưu
 */
export async function uploadIcon(file: File): Promise<KetQuaUpload> {
  const coSo = layCoSoApi();
  const url = `${coSo}/api/upload/icon`;
  const token = layAccessToken();

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
    signal: AbortSignal.timeout(layGiayHetHanFetch() * 1000),
  });

  if (!res.ok) {
    let data: unknown = null;
    const text = await res.text();
    try { data = JSON.parse(text); } catch { data = text; }
    throw new Error(docThongDiepLoi(data));
  }

  return res.json() as Promise<KetQuaUpload>;
}

/**
 * Xóa ảnh đã upload.
 * @param tenFile Tên file cần xóa
 */
export async function xoaAnh(tenFile: string): Promise<void> {
  const coSo = layCoSoApi();
  const url = `${coSo}/api/upload/anh/${encodeURIComponent(tenFile)}`;
  const token = layAccessToken();

  const res = await fetch(url, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok && res.status !== 404) {
    throw new Error("Xóa ảnh thất bại");
  }
}

/**
 * Xóa icon đã upload.
 * @param tenFile Tên file cần xóa
 */
export async function xoaIcon(tenFile: string): Promise<void> {
  const coSo = layCoSoApi();
  const url = `${coSo}/api/upload/icon/${encodeURIComponent(tenFile)}`;
  const token = layAccessToken();

  const res = await fetch(url, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok && res.status !== 404) {
    throw new Error("Xóa icon thất bại");
  }
}
