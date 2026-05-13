import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 gap-2',
  {
    variants: {
      variant: {
        // PRIMARY - Lưu/Save - Blue (chỉ có 1 primary button trên mỗi trang)
        default: 'text-white shadow-sm',
        primary: 'text-white shadow-sm',
        
        // SUCCESS - Thêm mới/Create - Green
        success: 'text-white',
        
        // WARNING - Sửa/Edit - Amber
        warning: 'text-white',
        
        // DANGER - Xóa/Delete - Red
        destructive: 'text-white',
        danger: 'text-white',
        
        // NEUTRAL - Hủy/Cancel - Gray
        neutral: 'text-white',
        cancel: 'text-white',
        
        // SECONDARY - Outline styles
        secondary: 'border-2 bg-transparent text-[#191c1f] hover:bg-[#191c1f] hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-[#191c1f]',
        outline: 'border-2 bg-transparent text-[#191c1f] hover:bg-[#191c1f] hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-[#191c1f]',
        ghost: 'bg-transparent text-[#191c1f] hover:bg-[#f4f4f4] dark:text-white dark:hover:bg-[#27272a]',
        
        // ACTION ICONS - Small buttons for table actions
        'action-edit': 'border hover h-9 w-9 p-0',
        'action-delete': 'border hover h-9 w-9 p-0',
        'action-view': 'border hover h-9 w-9 p-0',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, leftIcon, rightIcon, style, ...props }, ref) => {
    // Define dark mode aware inline styles
    const getVariantStyle = (): React.CSSProperties => {
      switch (variant) {
        case 'default':
        case 'primary':
          return { background: 'var(--color-primary)', color: 'white' };
        case 'success':
          return { background: 'var(--color-action-create)', color: 'white' };
        case 'warning':
          return { background: 'var(--color-action-edit)', color: 'white' };
        case 'destructive':
        case 'danger':
          return { background: 'var(--color-action-delete)', color: 'white' };
        case 'neutral':
        case 'cancel':
          return { background: 'var(--color-action-cancel)', color: 'white' };
        case 'secondary':
        case 'outline':
          return { 
            background: 'transparent', 
            border: '2px solid var(--text-primary)',
            color: 'var(--text-primary)'
          };
        case 'ghost':
          return { background: 'transparent', color: 'var(--text-primary)' };
        case 'action-edit':
          return { 
            background: 'var(--bg-edit)',
            border: '1px solid var(--color-action-edit)',
            color: 'var(--color-action-edit)'
          };
        case 'action-delete':
          return { 
            background: 'var(--bg-delete)',
            border: '1px solid var(--color-action-delete)',
            color: 'var(--color-action-delete)'
          };
        case 'action-view':
          return { 
            background: 'var(--surface-tertiary)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-secondary)'
          };
        default:
          return { background: 'var(--color-primary)', color: 'white' };
      }
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        style={{ ...getVariantStyle(), ...style }}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

// Action Button Component - Dùng cho các nút trong table
interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'edit' | 'delete' | 'view'
  children: React.ReactNode
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant, children, style, ...props }, ref) => {
    const variantStyles: Record<string, React.CSSProperties> = {
      edit: { 
        background: 'var(--bg-edit)',
        border: '1px solid var(--color-action-edit)',
        color: 'var(--color-action-edit)'
      },
      delete: { 
        background: 'var(--bg-delete)',
        border: '1px solid var(--color-action-delete)',
        color: 'var(--color-action-delete)'
      },
      view: { 
        background: 'var(--surface-tertiary)',
        border: '1px solid var(--card-border)',
        color: 'var(--text-secondary)'
      },
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'action-view', // fallback class
          className
        )}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ActionButton.displayName = 'ActionButton'

export { Button, buttonVariants, ActionButton }
