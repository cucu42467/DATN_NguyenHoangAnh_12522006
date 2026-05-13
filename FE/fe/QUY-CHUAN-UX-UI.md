# QUY CHUẨN UX/UI - ỨNG DỤNG QUẢN LÝ TÀI CHÍNH

> **Phiên bản**: 1.0  
> **Ngày tạo**: 2026-05-06  
> **Trạng thái**: Đang áp dụng

---

## MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Hệ thống màu sắc](#2-hệ-thống-màu-sắc)
3. [Button Hierarchy](#3-button-hierarchy)
4. [Form UX](#4-form-ux)
5. [Validation](#5-validation)
6. [Feedback & Toast](#6-feedback--toast)
7. [Table CRUD](#7-table-crud)
8. [Status Badge](#8-status-badge)
9. [Confirm Dialog](#9-confirm-dialog)
10. [Responsive](#10-responsive)
11. [Component Library](#11-component-library)
12. [Page Templates](#12-page-templates)

---

## 1. TỔNG QUAN

### 1.1 Nguyên tắc cốt lõi

```
✓ Không bắt user suy nghĩ
✓ Luôn có feedback tức thì
✓ Giảm thiểu số click
✓ Không reload toàn trang
✓ Mobile-first, touch-friendly
```

### 1.2 Design System

- **Framework**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + CSS Variables
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts, ApexCharts

---

## 2. HỆ THỐNG MÀU SẮC

### 2.1 Action Colors (QUAN TRỌNG)

| Hành động | Mã hex | Tailwind | Mô tả |
|-----------|--------|----------|-------|
| **Thêm mới** | `#22c55e` | `green-500` | Nút tạo record mới |
| **Lưu** | `#3b82f6` | `blue-500` | Primary action - chỉ 1/trang |
| **Sửa** | `#f59e0b` | `amber-500` | Chỉnh sửa record |
| **Xóa** | `#ef4444` | `red-500` | Xóa record - cần confirm |
| **Hủy** | `#6b7280` | `gray-500` | Quay lại/đóng |

### 2.2 Status Colors

| Trạng thái | Mã hex | Tailwind | Badge bg | Badge text |
|------------|--------|----------|----------|------------|
| **Hoạt động** | `#22c55e` | `green-500` | `green-50` | `green-600` |
| **Ngừng** | `#6b7280` | `gray-500` | `gray-100` | `gray-600` |
| **Lỗi** | `#ef4444` | `red-500` | `red-50` | `red-600` |
| **Đang xử lý** | `#f59e0b` | `amber-500` | `amber-50` | `amber-600` |

### 2.3 Semantic Colors

```css
/* Primary Brand */
--color-primary: #3b82f6;
--color-primary-hover: #2563eb;
--color-primary-light: #dbeafe;

/* Success - Thêm mới, Thu nhập */
--color-success: #22c55e;
--color-success-light: #dcfce7;

/* Warning - Sửa, Đang xử lý */
--color-warning: #f59e0b;
--color-warning-light: #fef3c7;

/* Danger - Xóa, Chi tiêu */
--color-danger: #ef4444;
--color-danger-light: #fee2e2;

/* Neutral - Hủy, Xem */
--color-neutral: #6b7280;
--color-neutral-light: #f3f4f6;

/* Text */
--color-text-primary: #191c1f;
--color-text-secondary: #505a63;
--color-text-muted: #8d969e;

/* Border */
--color-border: #e5e7eb;
--color-border-hover: #d1d5db;
```

---

## 3. BUTTON HIERARCHY

### 3.1 Cấu trúc Button

```tsx
// Button sizes: sm (h-9), default (h-11), lg (h-12)
// Button min-width: 44px (touch-friendly)
// Border-radius: rounded-xl (12px)
```

### 3.2 Button Variants

```tsx
// 1. PRIMARY - Lưu (chỉ có 1/trang)
<Button variant="primary" size="default">
  <Save className="h-4 w-4" />
  Lưu thay đổi
</Button>

// 2. SUCCESS - Thêm mới
<Button variant="success" size="default">
  <Plus className="h-4 w-4" />
  Thêm mới
</Button>

// 3. WARNING - Sửa
<Button variant="warning" size="sm">
  <Edit2 className="h-4 w-4" />
  Sửa
</Button>

// 4. DANGER - Xóa
<Button variant="danger" size="sm">
  <Trash2 className="h-4 w-4" />
  Xóa
</Button>

// 5. NEUTRAL - Hủy
<Button variant="neutral" size="default">
  Hủy bỏ
</Button>

// 6. OUTLINE - Secondary
<Button variant="outline" size="default">
  <Eye className="h-4 w-4" />
  Xem chi tiết
</Button>
```

### 3.3 Button States

```tsx
// Loading state - disable + spinner
<Button loading={isLoading} disabled={isLoading}>
  <Loader2 className="h-4 w-4 animate-spin" />
  Đang xử lý...
</Button>

// Disabled state
<Button disabled>
  Không khả dụng
</Button>
```

### 3.4 Button Colors trong globals.css

```css
/* Primary - Lưu/Save */
.btn-primary {
  background-color: #3b82f6;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

/* Success - Thêm mới/Create */
.btn-success {
  background-color: #22c55e;
  color: white;
}
.btn-success:hover:not(:disabled) {
  background-color: #16a34a;
}

/* Warning - Sửa/Edit */
.btn-warning {
  background-color: #f59e0b;
  color: white;
}
.btn-warning:hover:not(:disabled) {
  background-color: #d97706;
}

/* Danger - Xóa/Delete */
.btn-danger {
  background-color: #ef4444;
  color: white;
}
.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

/* Neutral - Hủy/Cancel */
.btn-neutral {
  background-color: #6b7280;
  color: white;
}
.btn-neutral:hover:not(:disabled) {
  background-color: #4b5563;
}
```

---

## 4. FORM UX

### 4.1 Layout Structure

```
┌─────────────────────────────────────────────────┐
│ Section: Thông tin cá nhân                      │
│ ┌─────────────────────┐ ┌─────────────────────┐  │
│ │ Label: Họ và tên    │ │ Label: Email        │  │
│ │ [________________]  │ │ [________________]  │  │
│ │                    │ │                    │  │
│ └─────────────────────┘ └─────────────────────┘  │
│ ┌─────────────────────────────────────────────┐  │
│ │ Label: Địa chỉ                              │  │
│ │ [_______________________________________]  │  │
│ └─────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────┤
│ Section: Thông tin tài khoản                    │
│ ┌─────────────────────┐ ┌─────────────────────┐  │
│ │ Label: Số tài khoản │ │ Label: Ngân hàng    │  │
│ │ [________________]  │ │ [________________]  │  │
│ └─────────────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────┘

Section spacing: 32px
Field spacing: 16px
Label size: 14px, weight 500
Input height: 48px
Border radius: 12px
```

### 4.2 Form Field Structure

```tsx
// Label luôn nằm trên input
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">
    Họ và tên <span className="text-red-500">*</span>
  </label>
  <input className="h-12 w-full rounded-xl border border-gray-200 ..." />
  {error && <p className="text-sm text-red-500">{error}</p>}
</div>

// KHÔNG BAO GIỜ dùng placeholder thay label
// ❌ <input placeholder="Nhập họ tên" />
// ✅ <input /> với <label>Họ và tên</label>
```

### 4.3 Form Grid

```tsx
// 2 columns on desktop
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input label="Họ" name="ho" />
  <Input label="Tên" name="ten" />
</div>

// Full width
<div className="grid grid-cols-1">
  <Input label="Địa chỉ" name="diaChi" />
</div>
```

### 4.4 Required Fields

```tsx
// Mark required với *
<label>
  Họ và tên <span className="text-red-500">*</span>
</label>

// Validation message
<p className="text-sm text-gray-500">
  Các trường có dấu <span className="text-red-500">*</span> là bắt buộc
</p>
```

---

## 5. VALIDATION

### 5.1 Validation Rules

```tsx
// Validate on blur hoặc submit
const [errors, setErrors] = useState<Record<string, string>>({});

// Validation examples
const validateEmail = (email: string) => {
  if (!email) return "Email là bắt buộc";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Email không đúng định dạng (ví dụ: ten@email.com)";
  return "";
};

const validatePassword = (password: string) => {
  if (!password) return "Mật khẩu là bắt buộc";
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
  return "";
};

const validatePhone = (phone: string) => {
  if (!phone) return "Số điện thoại là bắt buộc";
  if (!/^(0[0-9]{9,10})$/.test(phone.replace(/\s/g, '')))
    return "Số điện thoại phải có 10-11 chữ số, bắt đầu bằng 0";
  return "";
};

const validateAmount = (amount: number) => {
  if (!amount || amount <= 0) return "Số tiền phải lớn hơn 0";
  if (amount > 999999999999) return "Số tiền vượt quá giới hạn cho phép";
  return "";
};
```

### 5.2 Error Message Display

```tsx
// ❌ Sai - quá chung chung
"Tài khoản không hợp lệ"
"Số tiền không hợp lệ"
"Invalid input"

// ✅ Đúng - cụ thể và hữu ích
"Tài khoản phải có 8-20 ký tự, bao gồm chữ và số"
"Số tiền phải từ 1.000 đến 999.999.999.999 VNĐ"
"Email phải có định dạng: ten@tenmien.com"
```

### 5.3 Error Styling

```tsx
// Error state cho input
<input className={cn(
  "h-12 w-full rounded-xl border bg-white",
  error
    ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
)} />

// Error message
{error && (
  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500">
    <AlertCircle className="h-4 w-4" />
    {error}
  </p>
)}
```

---

## 6. FEEDBACK & TOAST

### 6.1 Toast Types

```tsx
// Success - Thành công (thêm mới, lưu, cập nhật)
showToast("Giao dịch đã được thêm thành công", "success");

// Error - Lỗi (thất bại, validate fail)
showToast("Không thể xóa giao dịch. Vui lòng thử lại.", "error");

// Warning - Cảnh báo (cảnh báo nhẹ)
showToast("Phiên đăng nhập sắp hết hạn", "warning");

// Info - Thông tin
showToast("Bạn có 3 thông báo mới", "info");
```

### 6.2 Toast Colors

```css
/* Success */
.bg-toast-success { background-color: #22c55e; }

/* Error */
.bg-toast-error { background-color: #ef4444; }

/* Warning */
.bg-toast-warning { background-color: #f59e0b; }

/* Info */
.bg-toast-info { background-color: #3b82f6; }
```

### 6.3 Loading States

```tsx
// Button loading
<Button loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      Đang xử lý...
    </>
  ) : (
    <>
      <Save className="h-4 w-4" />
      Lưu thay đổi
    </>
  )}
</Button>

// Full page loading
{isLoading ? (
  <PageSkeleton />
) : (
  <PageContent />
)}
```

---

## 7. TABLE CRUD

### 7.1 Standard Table Structure

```tsx
┌─────┬─────────────────┬───────────┬──────────┬────────────────┬───────────────┐
│ STT │ Tên             │ Trạng thái│ Ngày tạo │ Hành động      │               │
├─────┼─────────────────┼───────────┼──────────┼────────────────┼───────────────┤
│ 1   │ Nguyễn Văn A    │ ● Hoạt động│ 05/01/26 │ [Sửa] [Xóa]   │               │
│ 2   │ Trần Thị B      │ ● Ngừng    │ 04/15/26 │ [Sửa] [Xóa]   │               │
└─────┴─────────────────┴───────────┴──────────┴────────────────┴───────────────┘
```

### 7.2 Column Specifications

```tsx
// Table columns config
const columns = [
  { key: "stt", label: "STT", width: "w-16" },
  { key: "ten", label: "Tên", width: "flex-1" },
  { key: "trangThai", label: "Trạng thái", width: "w-32" },
  { key: "ngayTao", label: "Ngày tạo", width: "w-32" },
  { key: "hanhDong", label: "Thao tác", width: "w-32", align: "center" },
];

// Header style
<thead className="bg-gray-50 border-b border-gray-200">
  <tr>
    {columns.map(col => (
      <th 
        key={col.key}
        className={cn(
          "px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500",
          col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
        )}
      >
        {col.label}
      </th>
    ))}
  </tr>
</thead>
```

### 7.3 Action Buttons

```tsx
// Actions column - luôn hiển thị (không phải hover)
<td className="px-6 py-4">
  <div className="flex items-center justify-center gap-2">
    {/* Sửa - vàng */}
    <button className="btn-action btn-action-edit">
      <Edit2 className="h-4 w-4" />
    </button>
    
    {/* Xóa - đỏ */}
    <button className="btn-action btn-action-delete">
      <Trash2 className="h-4 w-4" />
    </button>
  </div>
</td>

// Action button styles
.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-action-edit {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
}
.btn-action-edit:hover {
  background: #fde68a;
}

.btn-action-delete {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.btn-action-delete:hover {
  background: #fecaca;
}
```

### 7.4 Status Badge

```tsx
// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    HOAT_DONG: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
    DUNG: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-500" },
    LOI: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
    DANG_XU_LY: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  }[status] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-500" };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", config.bg, config.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {LABEL[status]}
    </span>
  );
};
```

### 7.5 Empty State

```tsx
// Empty state component
const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: Props) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

// Usage
<EmptyState
  icon={Wallet}
  title="Chưa có giao dịch nào"
  description="Khi bạn thêm giao dịch mới, lịch sử sẽ xuất hiện tại đây."
  action={<Button variant="success">Thêm giao dịch</Button>}
/>
```

### 7.6 Pagination

```tsx
// Pagination component
<div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
  <div className="text-sm text-gray-500">
    Hiển thị {startItem} - {endItem} của {totalItems} kết quả
  </div>
  <div className="flex items-center gap-2">
    <Button 
      variant="outline" 
      size="sm"
      disabled={!hasPrevious}
      onClick={() => onPageChange(currentPage - 1)}
    >
      <ChevronLeft className="h-4 w-4" />
      Trước
    </Button>
    
    {/* Page numbers */}
    {pageNumbers.map(page => (
      <Button
        key={page}
        variant={page === currentPage ? "primary" : "outline"}
        size="sm"
        onClick={() => onPageChange(page)}
      >
        {page}
      </Button>
    ))}
    
    <Button 
      variant="outline" 
      size="sm"
      disabled={!hasNext}
      onClick={() => onPageChange(currentPage + 1)}
    >
      Tiếp
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
</div>
```

---

## 8. STATUS BADGE

### 8.1 Status Badge Variants

```tsx
// Badge variants
const BADGE_VARIANTS = {
  // Hoạt động / Active / Kích hoạt
  ACTIVE: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    label: "Hoạt động"
  },
  
  // Ngừng / Inactive / Vô hiệu hóa
  INACTIVE: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-500",
    label: "Ngừng"
  },
  
  // Lỗi / Error / Thất bại
  ERROR: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "Lỗi"
  },
  
  // Đang xử lý / Processing / Chờ duyệt
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    label: "Đang xử lý"
  },
  
  // Tạm khóa / Locked / Bị cấm
  LOCKED: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
    label: "Tạm khóa"
  },
} as const;
```

---

## 9. CONFIRM DIALOG

### 9.1 When to Use

Confirm dialog BẮT BUỘC với:
- Xóa record
- Thanh toán/giao dịch tiền
- Thay đổi trạng thái quan trọng (khóa tài khoản, hủy đơn)
- Bulk actions

### 9.2 Confirm Dialog Component

```tsx
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) => {
  if (!open) return null;

  const variantConfig = {
    danger: {
      icon: <Trash2 className="h-6 w-6 text-red-500" />,
      iconBg: "bg-red-100",
      buttonBg: "bg-red-500 hover:bg-red-600",
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
      iconBg: "bg-amber-100",
      buttonBg: "bg-amber-500 hover:bg-amber-600",
    },
    info: {
      icon: <Info className="h-6 w-6 text-blue-500" />,
      iconBg: "bg-blue-100",
      buttonBg: "bg-blue-500 hover:bg-blue-600",
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Icon */}
        <div className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-full", variantConfig.iconBg)}>
          {variantConfig.icon}
        </div>
        
        {/* Content */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            className={cn("flex-1 text-white", variantConfig.buttonBg)}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
```

### 9.3 Usage Examples

```tsx
// Xóa giao dịch
<ConfirmDialog
  open={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Xóa giao dịch?"
  description="Hành động này không thể hoàn tác. Giao dịch sẽ bị xóa vĩnh viễn."
  confirmText="Xóa"
  variant="danger"
/>

// Khóa tài khoản
<ConfirmDialog
  open={showLockConfirm}
  onClose={() => setShowLockConfirm(false)}
  onConfirm={handleLock}
  title="Khóa tài khoản?"
  description="Người dùng sẽ không thể đăng nhập cho đến khi bạn mở khóa."
  confirmText="Khóa"
  variant="warning"
/>

// Thanh toán
<ConfirmDialog
  open={showPaymentConfirm}
  onClose={() => setShowPaymentConfirm(false)}
  onConfirm={handlePayment}
  title="Xác nhận thanh toán?"
  description={`Bạn sẽ chuyển 5.000.000 VNĐ cho Nguyễn Văn A`}
  confirmText="Thanh toán"
  variant="info"
/>
```

---

## 10. RESPONSIVE

### 10.1 Breakpoints

```css
/* Mobile First */
--screen-sm: 640px;   /* Tablet nhỏ */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Laptop */
--screen-xl: 1280px;  /* Desktop */
--screen-2xl: 1536px; /* Desktop lớn */
```

### 10.2 Touch Targets

```tsx
// Minimum touch target: 44px
<button className="min-h-[44px] min-w-[44px]">
  Button
</button>

// Gap between touch targets: 8px minimum
<div className="flex gap-2">
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

### 10.3 Responsive Grid

```tsx
// Cards grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>

// Form grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input label="Trường 1" />
  <Input label="Trường 2" />
</div>

// Table scroll
<div className="overflow-x-auto">
  <table className="min-w-[800px]">
    {/* Table content */}
  </table>
</div>
```

---

## 11. COMPONENT LIBRARY

### 11.1 Component Structure

```
thanh_phan/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── index.ts
├── Select/
│   ├── Select.tsx
│   ├── index.ts
├── Badge/
│   ├── Badge.tsx
│   ├── StatusBadge.tsx
│   └── index.ts
├── Dialog/
│   ├── ConfirmDialog.tsx
│   ├── Dialog.tsx
│   └── index.ts
├── Table/
│   ├── Table.tsx
│   ├── TableHeader.tsx
│   ├── TableRow.tsx
│   ├── TablePagination.tsx
│   └── index.ts
├── Toast/
│   ├── Toast.tsx
│   └── index.ts
└── EmptyState/
    ├── EmptyState.tsx
    └── index.ts
```

### 11.2 Component Exports

```tsx
// thanh_phan/ui/index.ts
export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button';

export { default as Input } from './Input';
export { default as Select } from './Select';
export { Badge, StatusBadge } from './Badge';
export { ConfirmDialog, Dialog } from './Dialog';
export { Table, TableHeader, TableRow, TablePagination } from './Table';
export { Toast, ToastContainer, useToast, ToastProvider } from './Toast';
export { EmptyState } from './EmptyState';
```

---

## 12. PAGE TEMPLATES

### 12.1 List Page Template

```tsx
// app/(user)/TaiKhoan/page.tsx
export default function DanhSachTaiKhoanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTaiKhoanList({ page, search: searchTerm });

  return (
    <div className="fe-page-shell">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý tài khoản</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách tài khoản ngân hàng và ví điện tử
          </p>
        </div>
        <Button variant="success">
          <Plus className="h-4 w-4" />
          Thêm tài khoản
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <Input
          label="Tìm kiếm"
          placeholder="Nhập tên tài khoản..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />
        <Select
          label="Loại tài khoản"
          options={[{ value: "", label: "Tất cả" }, ...]}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : data?.items?.length ? (
        <Table>
          <TableHeader columns={columns} />
          <tbody>
            {data.items.map((item) => (
              <TableRow key={item.id} data={item} />
            ))}
          </tbody>
          <TablePagination
            pagination={data.pagination}
            onPageChange={setPage}
          />
        </Table>
      ) : (
        <EmptyState
          icon={Wallet}
          title="Chưa có tài khoản nào"
          description="Thêm tài khoản ngân hàng hoặc ví điện tử để bắt đầu quản lý tài chính."
          action={
            <Button variant="success">
              <Plus className="h-4 w-4" />
              Thêm tài khoản
            </Button>
          }
        />
      )}
    </div>
  );
}
```

### 12.2 Form Page Template

```tsx
// app/(user)/TaiKhoan/Them/page.tsx
export default function ThemTaiKhoanPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaiKhoanForm>();

  const onSubmit = async (data: TaiKhoanForm) => {
    setIsSubmitting(true);
    try {
      await createTaiKhoan(data);
      showToast("Tài khoản đã được thêm thành công", "success");
      router.push("/TaiKhoan");
    } catch (error) {
      showToast("Không thể thêm tài khoản. Vui lòng thử lại.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fe-page-shell">
      {/* Back link */}
      <Link href="/TaiKhoan" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Thêm tài khoản mới</h1>
        <p className="mt-1 text-sm text-gray-500">
          Điền thông tin tài khoản ngân hàng hoặc ví điện tử
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        {/* Section: Thông tin cơ bản */}
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Tên tài khoản"
              placeholder="VD: Vietcombank"
              error={errors.tenTaiKhoan?.message}
              {...register("tenTaiKhoan", { required: "Tên tài khoản là bắt buộc" })}
            />
            <Select
              label="Loại tài khoản"
              options={LOAI_TAI_KHOAN}
              error={errors.loaiTaiKhoan?.message}
              {...register("loaiTaiKhoan")}
            />
          </div>
          <Input
            label="Số tài khoản"
            placeholder="Nhập số tài khoản"
            error={errors.soTaiKhoan?.message}
            {...register("soTaiKhoan", { 
              required: "Số tài khoản là bắt buộc",
              pattern: {
                value: /^[0-9]{8,20}$/,
                message: "Số tài khoản phải có 8-20 chữ số"
              }
            })}
          />
        </div>

        {/* Section: Số dư ban đầu */}
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Số dư ban đầu</h2>
          <AmountInput
            label="Số dư"
            placeholder="0"
            error={errors.soDu?.message}
            {...register("soDu", { 
              required: "Số dư là bắt buộc",
              min: { value: 0, message: "Số dư không được âm" }
            })}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 border-t pt-6">
          <Button 
            type="button" 
            variant="neutral"
            onClick={() => router.push("/TaiKhoan")}
          >
            Hủy bỏ
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu tài khoản"}
          </Button>
        </div>
      </form>
    </div>
  );
}
```

### 12.3 Detail Page Template

```tsx
// app/(user)/TaiKhoan/[id]/page.tsx
export default function ChiTietTaiKhoanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { data, isLoading, refetch } = useTaiKhoan(params.id);
  const { mutate: updateTaiKhoan, isPending } = useUpdateTaiKhoan();
  const { mutate: deleteTaiKhoan } = useDeleteTaiKhoan();

  const handleUpdate = (data: Partial<TaiKhoan>) => {
    updateTaiKhoan(data, {
      onSuccess: () => {
        showToast("Tài khoản đã được cập nhật", "success");
        refetch();
      },
      onError: () => {
        showToast("Không thể cập nhật tài khoản", "error");
      }
    });
  };

  const handleDelete = () => {
    deleteTaiKhoan(params.id, {
      onSuccess: () => {
        showToast("Tài khoản đã được xóa", "success");
        router.push("/TaiKhoan");
      },
      onError: () => {
        showToast("Không thể xóa tài khoản", "error");
      }
    });
  };

  if (isLoading) return <PageSkeleton />;
  if (!data) return <NotFound />;

  return (
    <div className="fe-page-shell">
      {/* Header with actions */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/TaiKhoan" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="warning" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
            Sửa
          </Button>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Detail Card */}
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{data.tenTaiKhoan}</h1>
            <p className="text-sm text-gray-500">{data.soTaiKhoan}</p>
            <StatusBadge status={data.trangThai} className="mt-2" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Số dư</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(data.soDu)}
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Loại</p>
            <p className="font-medium">{data.loaiTaiKhoan}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ngân hàng</p>
            <p className="font-medium">{data.nganHang || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ngày tạo</p>
            <p className="font-medium">{formatDate(data.ngayTao)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cập nhật</p>
            <p className="font-medium">{formatDate(data.ngayCapNhat)}</p>
          </div>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Xóa tài khoản?"
        description={`Bạn có chắc muốn xóa tài khoản "${data.tenTaiKhoan}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        variant="danger"
      />
    </div>
  );
}
```

---

## CHECKLIST TRƯỚC KHI SHIP

```markdown
- [ ] Tất cả form có label rõ ràng (không placeholder thay label)
- [ ] Validation messages cụ thể và hữu ích
- [ ] Error state hiển thị đúng màu đỏ
- [ ] Success state hiển thị toast xanh
- [ ] Button hierarchy đúng (1 primary, các button khác secondary/outline)
- [ ] Action colors đúng (Thêm=xanh, Sửa=vàng, Xóa=đỏ, Lưu=xanh dương)
- [ ] Confirm dialog cho tất cả hành động nguy hiểm
- [ ] Empty state cho tất cả list pages
- [ ] Loading states cho tất cả async operations
- [ ] Responsive trên mobile (touch targets 44px)
- [ ] Không sử dụng placeholder thay label
- [ ] Keyboard navigation hoạt động
- [ ] Focus states rõ ràng
```

---

## QUY TẮC ĐẶT TÊN

```tsx
// Component names: PascalCase
MyComponent.tsx
StatusBadge.tsx
ConfirmDialog.tsx

// Hook names: camelCase với prefix "use"
useTaiKhoanList.ts
useGiaoDich.ts

// Service names: camelCase
giaodich.dich_vu.ts
taikhoan.dich_vu.ts

// Type names: PascalCase
TaiKhoanDto
GiaoDichForm

// Variable names: camelCase
const taiKhoanList = [];
const currentPage = 1;

// CSS class names: kebab-case
className="flex items-center gap-4"
className="bg-green-50 text-green-600"
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-06  
**Author**: UX/UI Team
