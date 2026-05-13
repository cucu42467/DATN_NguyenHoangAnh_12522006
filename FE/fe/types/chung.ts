import type { NguoiDungTomTat } from "@/thu_vien/kieu_giao_tiep";

export interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  user?: NguoiDungTomTat | null;
  onLogout: () => void | Promise<void>;
}
