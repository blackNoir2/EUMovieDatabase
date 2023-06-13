/**
 * Returns the first element within the document that matches the specified
 * selector, passed as a parameter. The selector can be any valid CSS selector.
 * 
 * @param {string} identifier - A string containing one or more CSS selectors separated
 * by commas, spaces, or a combination of both.
 * @returns {Element|null} - The first Element node that matches the specified
 * selector(s), or null if no matches are found.
 */
function getQuery(identifier) {
    return document.querySelector(identifier);
  }
  
  
export {
    getQuery,
}