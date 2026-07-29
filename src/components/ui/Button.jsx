import React from 'react';

const variants = {
  primary: 'bg-[#e85c0d] hover:bg-[#c44d0b] text-white border-transparent shadow-[0_0_20px_rgba(232,92,13,0.3)] hover:shadow-[0_0_30px_rgba(232,92,13,0.5)]',
  secondary: 'bg-transparent border-[#e85c0d] text-[#e85c0d] hover:bg-[#e85c0d] hover:text-white',
  danger: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white border-transparent',
  ghost: 'bg-transparent border-[#2a2a2a] text-[#94a3b8] hover:border-[#3a3a3a] hover:text-white',
  success: 'bg-[#22c55e] hover:bg-[#16a34a] text-white border-transparent',
  pink: 'bg-[#ec4899] hover:bg-[#db2777] text-white border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
  xl: 'px-8 py-4 text-lg gap-3',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center font-semibold rounded-lg border
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        font-[Rajdhani,Inter,sans-serif] tracking-wide
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}
