export function StatusBadge({ status }) {
  const config = {
    confirmed: { label: 'Confirmado', cls: 'badge-confirmed' },
    pending: { label: 'Pendente', cls: 'badge-pending' },
    cancelled: { label: 'Cancelado', cls: 'badge-cancelled' },
    blocked: { label: 'Bloqueado', cls: 'badge-blocked' },
    available: { label: 'Disponível', cls: 'badge-confirmed' },
    active: { label: 'Ativo', cls: 'badge-confirmed' },
    inactive: { label: 'Inativo', cls: 'badge-blocked' },
    expired: { label: 'Expirado', cls: 'badge-cancelled' },
  };
  const c = config[status] || { label: status, cls: 'badge-pending' };
  return <span className={`badge ${c.cls}`}>{c.label}</span>;
}

export function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-[#e85c0d]/15 text-[#e85c0d] border-[#e85c0d]/30',
    danger: 'bg-[#dc2626]/15 text-[#dc2626] border-[#dc2626]/30',
    success: 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30',
    warning: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30',
    pink: 'bg-[#ec4899]/15 text-[#ec4899] border-[#ec4899]/30',
    muted: 'bg-[#64748b]/15 text-[#64748b] border-[#64748b]/30',
  };
  return (
    <span className={`badge ${variants[variant]} ${className}`}>{children}</span>
  );
}
