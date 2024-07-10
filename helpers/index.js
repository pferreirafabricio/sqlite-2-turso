/**
 * @param {string} str 
 * @param {number} limit 
 * @returns 
 */
export function truncate(str, limit = 1000) {
  return str.length > limit ? `${str.substring(0, limit)}...` : str;
}