import { goiApiGet, goiApiPut } from '../thu_vien/goi_api';

/* ========== DTO ========== */
export interface CaiDatDto {
  caiDatId: number;
  nguoiDungId: number;
  ngonNgu?: string;
  tienTe?: string;
  cheDoToi: boolean;
  dinhDangNgay?: string;
  nhanThongBao: boolean;
  thongBaoJson?: string;
}

export interface TaoCaiDatDto {
  ngonNgu?: string;
  tienTe?: string;
  cheDoToi: boolean;
  dinhDangNgay?: string;
  nhanThongBao: boolean;
  thongBaoJson?: string;
}

/* ========== Cài đặt thông báo chi tiết ========== */
export interface ThongBaoSettings {
  nhanQuaApp: boolean;
  nhanQuaEmail: boolean;
  nhanQuaPush: boolean;
  thongBaoVuotNganSach: boolean;
  thongBaoSoDuThap: boolean;
  thongBaoGiaoDich: boolean;
  thongBaoNhacNho: boolean;
  thongBaoMucTieu: boolean;
  thongBaoAi: boolean;
  chiCanhBaoQuanTrong: boolean;
  nguongVuotNganSach: number;
  nguongSoDuThap: number;
}

export const MAC_DINH_THONG_BAO: ThongBaoSettings = {
  nhanQuaApp: true,
  nhanQuaEmail: false,
  nhanQuaPush: true,
  thongBaoVuotNganSach: true,
  thongBaoSoDuThap: true,
  thongBaoGiaoDich: false,
  thongBaoNhacNho: true,
  thongBaoMucTieu: true,
  thongBaoAi: true,
  chiCanhBaoQuanTrong: false,
  nguongVuotNganSach: 80,
  nguongSoDuThap: 1000000,
};

const DUONG_DAN = '/api/caidat';
const KEY_CACHE = 'thongBaoSettings_cache';

/* ========== API ========== */
/** Lấy cài đặt từ API */
export async function layCaiDat(): Promise<CaiDatDto | null> {
  const response = await goiApiGet<any>(DUONG_DAN);
  if (response && typeof response === 'object') {
    return response.data ?? response;
  }
  return null;
}

/** Cập nhật cài đặt */
export async function capNhatCaiDat(dto: TaoCaiDatDto): Promise<void> {
  return goiApiPut<void>(DUONG_DAN, dto);
}

/* ========== Helper ========== */
/** Parse JSON settings từ response */
export function parseThongBaoSettings(caiDat: CaiDatDto | null): ThongBaoSettings {
  if (!caiDat?.thongBaoJson) return MAC_DINH_THONG_BAO;
  try {
    return { ...MAC_DINH_THONG_BAO, ...JSON.parse(caiDat.thongBaoJson) };
  } catch {
    return MAC_DINH_THONG_BAO;
  }
}

/** Serialize settings thành JSON string */
export function serializeThongBaoSettings(settings: ThongBaoSettings): string {
  return JSON.stringify(settings);
}
