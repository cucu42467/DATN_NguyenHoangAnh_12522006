// ThongBao DTOs - Map với tbl_thongbao

export type LoaiThongBao = 'HE_THONG' | 'CANH_BAO' | 'GOI_Y' | 'DU_DOAN';

export interface ThongBaoDto {
  thongBaoId: number;
  nguoiDungId: number;
  tieuDe: string;
  noiDung?: string;
  loaiThongBao: number; // 1: HeThong, 2: CanhBao, 3: GoiY, 4: DuDoan
  loaiThongBaoText?: string;
  ngayTao: string;
  daDoc: boolean;
  // ← THÊM MỚI: 4 trường mới cho tbl_thongbao
  loaiDoiTuong?: string;   // giaodich/ngansach/muctieu/taikhoan/giaodich_dinhky
  doiTuongId?: number;    // ID của đối tượng liên quan
  duongDanDieuHuong?: string;  // VD: /giaodich/5007, /ngansach/6001
  ngayHetHan?: string;    // NULL = không hết hạn
}

export interface ThongBaoItem {
  thongBaoId: number;
  tieuDe: string;
  noiDung?: string;
  loaiThongBao: LoaiThongBao;
  ngayTao: string;
  daDoc: boolean;
  icon?: string;
  mauSac?: string;
  // ← THÊM MỚI: duongDanDieuHuong
  duongDanDieuHuong?: string;
}
