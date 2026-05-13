/**
 * Shared Constants
 */

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.49.145.68:5000';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const ISO_DATE_FORMAT = 'YYYY-MM-DD';

// Currency
export const CURRENCY_SYMBOL = 'đ';
export const CURRENCY_LOCALE = 'vi-VN';

// Animation
export const ANIMATION_DURATION = 300;
export const ANIMATION_DELAY = 100;

// Breakpoints (Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
