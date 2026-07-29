export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

export function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function validateMinLength(value, min) {
  return String(value).trim().length >= min;
}

export function validateDate(value) {
  const date = new Date(value);
  return !isNaN(date.getTime());
}

export function validateFutureDate(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value + 'T12:00:00');
  return date >= today;
}

export function validatePositiveNumber(value) {
  return !isNaN(value) && Number(value) > 0;
}
