/** טלפון ישראלי: 05XXXXXXXX / 0XXXXXXXX / ‎+972… */
export function isValidPhone(v: string) {
  const d = v.replace(/\D/g, "");
  return /^0\d{8,9}$/.test(d) || /^972\d{8,9}$/.test(d);
}
