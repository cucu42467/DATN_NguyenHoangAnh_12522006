import type { LocGiaoDichDto } from "@/types";

export const queryKeys = {
  giaoDich: {
    all: ["giao-dich"] as const,
    list: (filter: LocGiaoDichDto) => ["giao-dich", "list", filter] as const,
    detail: (id: number) => ["giao-dich", "detail", id] as const,
    tongQuan: ["giao-dich", "tong-quan"] as const,
  },
  danhMuc: {
    all: ["danh-muc"] as const,
    list: ["danh-muc", "list"] as const,
    detail: (id: number) => ["danh-muc", "detail", id] as const,
  },
  taiKhoan: {
    all: ["tai-khoan"] as const,
    list: ["tai-khoan", "list"] as const,
    detail: (id: number) => ["tai-khoan", "detail", id] as const,
  },
  adminDashboard: {
    all: ["admin-dashboard"] as const,
    tongQuan: ["admin-dashboard", "tong-quan"] as const,
  },
} as const;
