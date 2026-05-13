/**
 * Validation utilities - Các hàm validate theo tiêu chuẩn UX
 */

export type ValidationResult = string | null;

export type ValidatorFn = (value: unknown) => ValidationResult;

export type AsyncValidatorFn = (value: unknown) => Promise<ValidationResult>;

// ============================================
// STRING VALIDATORS
// ============================================

export function required(message = "Trường này là bắt buộc"): ValidatorFn {
  return (value: unknown) => {
    if (value === null || value === undefined) return message;
    if (typeof value === 'string' && value.trim() === '') return message;
    return null;
  };
}

export function minLength(min: number, fieldName = "Giá trị"): ValidatorFn {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    if (value.length < min) {
      return `${fieldName} phải có ít nhất ${min} ký tự`;
    }
    return null;
  };
}

export function maxLength(max: number, fieldName = "Giá trị"): ValidatorFn {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    if (value.length > max) {
      return `${fieldName} không được vượt quá ${max} ký tự`;
    }
    return null;
  };
}

export function pattern(regex: RegExp, message: string): ValidatorFn {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    if (!regex.test(value)) return message;
    return null;
  };
}

// ============================================
// EMAIL VALIDATOR
// ============================================

export function email(message?: string): ValidatorFn {
  const defaultMessage = "Email phải có định dạng hợp lệ (ví dụ: ten@email.com)";
  return pattern(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message || defaultMessage
  );
}

// ============================================
// PHONE VALIDATOR
// ============================================

export function phone(message?: string): ValidatorFn {
  const defaultMessage = "Số điện thoại phải có 10-11 chữ số, bắt đầu bằng 0";
  return pattern(
    /^(0[0-9]{9,10})$/,
    message || defaultMessage
  );
}

// ============================================
// NUMBER VALIDATORS
// ============================================

export function minValue(min: number, fieldName = "Giá trị"): ValidatorFn {
  return (value: unknown) => {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(num)) return null;
    if (num < min) {
      return `${fieldName} phải từ ${min.toLocaleString('vi-VN')} trở lên`;
    }
    return null;
  };
}

export function maxValue(max: number, fieldName = "Giá trị"): ValidatorFn {
  return (value: unknown) => {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(num)) return null;
    if (num > max) {
      return `${fieldName} không được vượt quá ${max.toLocaleString('vi-VN')}`;
    }
    return null;
  };
}

export function positiveNumber(fieldName = "Số tiền"): ValidatorFn {
  return (value: unknown) => {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(num)) return null;
    if (num <= 0) {
      return `${fieldName} phải lớn hơn 0`;
    }
    return null;
  };
}

// ============================================
// DATE VALIDATORS
// ============================================

export function pastDate(fieldName = "Ngày"): ValidatorFn {
  return (value: unknown) => {
    if (!value) return null;
    const date = new Date(String(value));
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    if (date >= new Date()) {
      return `${fieldName} phải là ngày trong quá khứ`;
    }
    return null;
  };
}

export function futureDate(fieldName = "Ngày"): ValidatorFn {
  return (value: unknown) => {
    if (!value) return null;
    const date = new Date(String(value));
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    if (date <= new Date()) {
      return `${fieldName} phải là ngày trong tương lai`;
    }
    return null;
  };
}

export function dateRange(minDate?: Date, maxDate?: Date, fieldName = "Ngày"): ValidatorFn {
  return (value: unknown) => {
    if (!value) return null;
    const date = new Date(String(value));
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    
    if (minDate && date < minDate) {
      return `${fieldName} phải từ ngày ${minDate.toLocaleDateString('vi-VN')}`;
    }
    if (maxDate && date > maxDate) {
      return `${fieldName} không được sau ngày ${maxDate.toLocaleDateString('vi-VN')}`;
    }
    return null;
  };
}

// ============================================
// ACCOUNT NUMBER VALIDATOR
// ============================================

export function accountNumber(message?: string): ValidatorFn {
  const defaultMessage = "Số tài khoản phải có 8-20 chữ số";
  return pattern(
    /^[0-9]{8,20}$/,
    message || defaultMessage
  );
}

// ============================================
// PASSWORD VALIDATOR
// ============================================

export function password(minLength = 8): ValidatorFn {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    if (value.length === 0) return null; // Let required() handle empty
    
    const errors: string[] = [];
    
    if (value.length < minLength) {
      errors.push(`ít nhất ${minLength} ký tự`);
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("ít nhất 1 chữ hoa");
    }
    if (!/[a-z]/.test(value)) {
      errors.push("ít nhất 1 chữ thường");
    }
    if (!/[0-9]/.test(value)) {
      errors.push("ít nhất 1 chữ số");
    }
    
    if (errors.length > 0) {
      return `Mật khẩu phải có ${errors.join(', ')}`;
    }
    return null;
  };
}

// ============================================
// COMBINE VALIDATORS
// ============================================

export function compose(...validators: ValidatorFn[]): ValidatorFn {
  return (value: unknown) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}

export function composeAsync(
  ...validators: Array<ValidatorFn | AsyncValidatorFn>
): AsyncValidatorFn {
  return async (value: unknown) => {
    for (const validator of validators) {
      const result = typeof validator === 'function' ? validator(value) : await validator;
      if (result !== null) return result;
    }
    return null;
  };
}

// ============================================
// FORM VALIDATION HOOK HELPERS
// ============================================

export interface FieldValidator<T> {
  validate: (value: T) => ValidationResult;
  message?: string;
}

export function validateField<T>(
  value: T,
  ...validators: ValidatorFn[]
): ValidationResult {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
}

export function validateForm<T extends Record<string, unknown>>(
  values: T,
  schema: Record<keyof T, ValidatorFn[]>
): Record<keyof T, ValidationResult> {
  const errors = {} as Record<keyof T, ValidationResult>;
  
  for (const key in schema) {
    const value = values[key];
    const validators = schema[key];
    
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  }
  
  return errors;
}

export function hasErrors<T extends Record<string, unknown>>(
  errors: Record<keyof T, ValidationResult>
): boolean {
  return Object.values(errors).some(error => error !== null);
}

// ============================================
// COMMON VALIDATION SCHEMAS
// ============================================

export const validationSchemas = {
  email: () => [required(), email()],
  
  phone: () => [required(), phone()],
  
  password: (minLength = 8) => [required(), password(minLength)],
  
  taiKhoan: () => [required(), accountNumber()],
  
  soTien: (min = 0, max = Number.MAX_SAFE_INTEGER) => [
    required("Số tiền là bắt buộc"),
    minValue(min, "Số tiền"),
    maxValue(max, "Số tiền"),
  ],
  
  hoTen: () => [
    required("Họ và tên là bắt buộc"),
    minLength(2, "Họ và tên"),
    maxLength(100, "Họ và tên"),
  ],
  
  tenDanhMuc: () => [
    required("Tên danh mục là bắt buộc"),
    minLength(2, "Tên danh mục"),
    maxLength(50, "Tên danh mục"),
  ],
  
  ghiChu: () => [maxLength(500, "Ghi chú")],
} as const;

export default validationSchemas;
