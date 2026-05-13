export interface SerieType {
  name: string;
  data: number[];
}

export interface BaoCaoTongQuanType {
  Labels: string[];
  Series: SerieType[];
}

export interface PhanBoDanhMucType {
  Labels: string[];
  Series: number[];
}

// ============== BÁO CÁO TÀI KHOẢN ==============

export interface LoaiTaiKhoanPhanBoType {
  loaiTaiKhoanId: number;
  tenLoai: string;
  tongSoDu: number;
  tyLe: number;
  soLuongTaiKhoan: number;
}

export interface TaiKhoanBaoCaoType {
  taiKhoanId: number;
  tenTaiKhoan: string;
  tenLoaiTaiKhoan: string;
  soDuHienTai: number;
  soDuDauThang: number;
  soDuCuoiThang: number;
  bienDong: number;
  hanMuc?: number;
  daSuDung?: number;
  tyLeSuDung?: number;
}

export interface BaoCaoTaiKhoanType {
  tongTaiSan: number;
  phanBoTheoLoai: LoaiTaiKhoanPhanBoType[];
  danhSachTaiKhoan: TaiKhoanBaoCaoType[];
  bienDongSoDu: BaoCaoTongQuanType;
}

// ============== BÁO CÁO DANH MỤC CHI TIÊU ==============

export interface DanhMucChiTieuType {
  danhMucId: number;
  tenDanhMuc: string;
  danhMucChaId?: number;
  tongTien: number;
  soGiaoDich: number;
  tyLe: number;
}

export interface DanhMucSoSanhType {
  danhMucId: number;
  tenDanhMuc: string;
  tienThangNay: number;
  tienThangTruoc: number;
  chenhLech: number;
  tyLeThayDoi: number;
}

export interface DanhMucConType {
  danhMucId: number;
  tenDanhMuc: string;
  tongTien: number;
  soGiaoDich: number;
}

export interface DanhMucChaType {
  danhMucId: number;
  tenDanhMuc: string;
  tongTien: number;
  soGiaoDich: number;
  danhMucCon: DanhMucConType[];
}

export interface TopDanhMucType {
  rank: number;
  danhMucId: number;
  tenDanhMuc: string;
  tongTien: number;
  soGiaoDich: number;
  tyLe: number;
}

export interface BaoCaoDanhMucType {
  tongChiTieu: number;
  soGiaoDich: number;
  chiTieuTheoDanhMuc: DanhMucChiTieuType[];
  soSanhThangTruoc: DanhMucSoSanhType[];
  danhMucCha: DanhMucChaType[];
  topDanhMuc: TopDanhMucType[];
}

// ============== BÁO CÁO NGÂN SÁCH ==============

export interface NganSachChiTietType {
  nganSachId: number;
  danhMucId: number;
  tenDanhMuc: string;
  hanMuc: number;
  daSuDung: number;
  conLai: number;
  tyLeSuDung: number;
  laVuot: boolean;
}

export interface NganSachCanhBaoType {
  danhMucId: number;
  tenDanhMuc: string;
  hanMuc: number;
  daSuDung: number;
  tyLeSuDung: number;
  mucDo: 'VUOT' | 'GAN_VUOT' | 'CANH_BAO';
}

export interface NganSachLichSuType {
  thang: number;
  nam: number;
  tongHanMuc: number;
  tongDaSuDung: number;
  coVuot: boolean;
  tyLeSuDung: number;
}

export interface BaoCaoNganSachType {
  tongHanMuc: number;
  tongDaSuDung: number;
  tongConLai: number;
  tyLeSuDungTrungBinh: number;
  chiTietNganSach: NganSachChiTietType[];
  canhBao: NganSachCanhBaoType[];
  lichSuThucHien: NganSachLichSuType[];
  tyLeTuanThu: number;
}

// ============== BÁO CÁO MỤC TIÊU TIẾT KIỆM ==============

export interface DongGopType {
  dongGopId: number;
  soTien: number;
  ngayTao: string;
  ghiChu?: string;
}

export interface MucTieuBaoCaoType {
  mucTieuId: number;
  tenMucTieu: string;
  moTa?: string;
  mucTieu: number;
  daDat: number;
  conLai: number;
  tyLeHoanThanh: number;
  trungBinhThang: number;
  ngayDuKien?: string;
  hanChot?: string;
  daHoanThanh: boolean;
  lichSuDongGop: DongGopType[];
}

export interface BaoCaoMucTieuType {
  tongMucTieu: number;
  mucTieuHoanThanh: number;
  tongDaTietKiem: number;
  danhSachMucTieu: MucTieuBaoCaoType[];
}
