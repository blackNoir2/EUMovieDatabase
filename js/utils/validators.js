import { getQuery } from "./queryFinder.js";

/**
 * Checks if an email contains invalid characters.
 *
 * @param {string} email - The email to check for invalid characters.
 * @returns {boolean} - True if the email contains invalid characters, false otherwise.
 */
function containsInvalidEmailCharacters(email) {
    const specialCharactersNotAllowed = " \" , [ ] < > ( )";
    
    if (doesStringContainSpecialChars(email, specialCharactersNotAllowed)) {
      return true;
    }
    
    return false;
  }





/**
 * Checks if a string contains any special characters.
 *
 * This function uses a regular expression pattern to test if the provided string contains any of the special characters
 * defined in the `specialCharacters` string. It returns a boolean value indicating whether special characters are found.
 *
 * @param {string} stringToCheck - The string to be checked for special characters.
 * @param {string} specialCharacters - A string containing the special characters. Only special characters are allowed in this string.
 * @returns {boolean} - `true` if the string contains special characters, `false` otherwise.
 * @throws {Error} If the `specialCharacters` string contains non-special characters.
 */

function doesStringContainSpecialChars(stringToCheck, specialCharacters="!@#$%^&*()_+-={}[]|\\;:\"'<>?/~ ") {
    // Check if specialCharacters is a valid string of only special characters
    const specialCharsRegex = /^[!@#$%^&*()_+\-={}[\]|\\;:'"<>,.?/~\s]+$/;
    if (!specialCharsRegex.test(specialCharacters)) {
      throw new Error("Invalid special characters string. Only special characters are allowed.");
    }
  
    return new RegExp(`[${specialCharacters.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}]`).test(stringToCheck);
    
  }
  
  
/**
 * Checks if two passwords match.
 *
 * @param {string} password1 - The first password to compare.
 * @param {string} password2 - The second password to compare.
 * @returns {boolean} - True if the passwords match, false otherwise.
 */
function isPasswordsAMatch(password1, password2) {
    return password1 === password2;
  }



/**
* Sanitizes the input string by parsing it as HTML and returning only the text content.
*
* @param {string} input The input string to sanitize
* @returns {string} The sanitized string with all HTML tags removed
*/
function sanitizeInput(input) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(`<!doctype html><body>${input}`, 'text/html');
    const text = dom.body.textContent;
    return text;
  }
  


/**
 * Validates the field's input for links and URLs, and clears the field if found.
 *
 * This function attaches an event listener to the specified field, validating its input for links and URLs.
 * If a link or URL is found in the field's input, the field will be cleared.
 *
 * @param {string} fieldSelector - The CSS selector (id or class name) of the field to validate and clear.
 * @returns {void}
 */
function validateAndClearFieldFromLinksAndUrls(fieldSelector) {

    const field = getQuery(fieldSelector);
  
    if (field) {
      field.addEventListener('input', function (event) {
  
        const string        = event.target.value;
        const isStringALink = isLink(string);
        const isImageLink   =  isImage(string);
        const isValidUrl    = isURL(string);
       
        if (isStringALink || isImageLink || isValidUrl) {
          clearFieldAndAlert(field);
        }
      });
    }
  
    
  }
  
  
  
  /**
   * Check if a string is a link.
   *
   * @param {string} string - The string to check.
   * @returns {boolean} - `true` if the string is a link, `false` otherwise.
   */
  function isLink(string) {
    const isHttp = string.startsWith("http://");
    const isHttps = string.startsWith("https://");
    const isWWW = string.startsWith("www.");
  
    return isHttp || isHttps || isWWW;
  }
  
  function isImage(string) {
    return string.startsWith('data:image/');
  }
  
  /**
   * Checks if the given input is a valid URL.
   * 
   * @param {string} input - The input string to check.
   * @returns {boolean} - Returns true if the input is a valid URL, otherwise false.
   */
  function isURL(input) {
  
    try {
      new URL(input, "http://");
      return true;
    } catch (error) {
      const urlRegex = /\.(com|co\.uk|net|org|io|html|htm|css|js|jpg|jpeg|png|gif|svg|mp4|avi|mov|wmv|mp3|wav|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|tar|gz)$/i;
  
      return urlRegex.test(input);
     
    }
  }
  
/**
 * Clear the field and display an alert.
 *
 * @param {Element} field - The field element to clear.
 * @returns {void}
 */
function clearFieldAndAlert(field) {
    field.value = "";
    alert("Links, Images are not allowed in this field.");
  }
  


export {
    containsInvalidEmailCharacters,
    doesStringContainSpecialChars,
    isPasswordsAMatch,
    isImage,
    isLink,
    isURL,
    validateAndClearFieldFromLinksAndUrls,
    sanitizeInput,

}