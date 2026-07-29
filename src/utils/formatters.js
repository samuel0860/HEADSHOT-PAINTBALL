// Utilitários de formatação e máscaras

export function phoneMask(value) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
}

export function dateMask(value) {
  if (!value) return '';
  return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3').substring(0, 10);
}

export function cpfMask(value) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('pt-BR');
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function generateBookingCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'HS-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getStatusLabel(status) {
  const labels = {
    confirmed: 'Confirmado',
    pending: 'Pendente',
    cancelled: 'Cancelado',
    blocked: 'Bloqueado',
    available: 'Disponível',
  };
  return labels[status] || status;
}

export function getStatusClass(status) {
  const classes = {
    confirmed: 'badge-confirmed',
    pending: 'badge-pending',
    cancelled: 'badge-cancelled',
    blocked: 'badge-blocked',
  };
  return classes[status] || '';
}

export function getDayOfWeek(dateStr) {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const date = new Date(dateStr + 'T12:00:00');
  return days[date.getDay()];
}

export function isDatePast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + 'T12:00:00');
  return date < today;
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function getMinDate() {
  return getTodayString();
}

export function truncate(str, n = 60) {
  return str.length > n ? str.substr(0, n - 1) + '…' : str;
}
