/**
 * @param {number} index
 * @returns {string}
 */
function padIndex(index) {
  return String(index + 1).padStart(2, '0');
}

export { padIndex };
