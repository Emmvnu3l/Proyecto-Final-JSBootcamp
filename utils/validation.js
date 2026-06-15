function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isNonEmptyString(value, maxLength) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (maxLength !== undefined && trimmed.length > maxLength) return false;
  return true;
}

module.exports = {
  isValidEmail,
  isNonEmptyString,
};
