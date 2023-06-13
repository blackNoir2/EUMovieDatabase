

import { getQuery } from "./queryFinder.js";
import { UserSession } from "../database.js";
import { User } from "../user.js";


/**
 * Handle Unauthorized Access
 *
 * This function is responsible for handling unauthorized access to restricted pages or resources.
 * It checks if the user is logged in and redirects them to the appropriate page based on their login status.
 * The function also performs login state checks on multiple tabs, ensuring consistent redirection.
 *
 * @param {string} [logoutRedirectPage="login.html"] - The page to redirect to if the user is not logged in.
 * @param {string} [loginRedirectPage="index.html"] - The page to redirect to if the user is already logged in.
 * @returns {void}
 */

function handleUnauthorizedAccess(logoutRedirectPage = "login.html", loginRedirectPage = "index.html") {

  
    const userObj = new User();
    const session = new UserSession()
    const user    = userObj.getByUsername(session.getSession("username"));
    
    let isLoggedIn = user && user.isLoggedIn;
    const url        = window.location.pathname.includes("login.html");


    if (isLoggedIn && url) {
        redirectPage(loginRedirectPage);

    } else if (!isLoggedIn) {
        redirectPage(logoutRedirectPage, 1);
        
    }
}


/**
 * Redirects the page to the specified page after a certain delay.
 * 
 * @param {string} pageToRedirectTo - The page to redirect to.
 * @param {number} delayBy - The delay in milliseconds before redirecting.
 * @returns {boolean} - Indicates if the redirection is initiated.
 */
function redirectPage(pageToRedirectTo, delayBy) {

    if (window.location.pathname !== `/${pageToRedirectTo}`) {
        setTimeout(() => {
            window.location.href = pageToRedirectTo;
        }, delayBy);
    }
    return true;
}


/**
 * Updates the character count information based on the length of the text in the textarea.
 *
 * @param {number} maximumNumOfChars - The maximum number of characters allowed in the textarea.
 * @param {HTMLTextAreaElement} textAreaElement - The textarea element to count characters from.
 * @param {string} dangerColor - (Optional) The color to be used when the remaining character count is in the danger zone. Default: "red".
 * @param {string} normalColor - (Optional) The color to be used when the remaining character count is not in the danger zone. Default: "black".
 * @returns {void}
 */
function remainingCharacters(maximumNumOfChars, textAreaElement, dangerColor = "red", normalColor = "black") {

    const numChars            = textAreaElement.value.length;
    const charsRemaining      = maximumNumOfChars - numChars;
    const charCountInfo       = getQuery(".char-count-msg");
    charCountInfo.textContent = `You have ${charsRemaining} characters remaining`;
    charCountInfo.style.color = charsRemaining <= 50 ? dangerColor : normalColor;
}


/**
 * Truncates a string to a specified maximum length by adding ellipsis at the end if needed.
 *
 * @param {string} str - The string to truncate.
 * @param {number} maxLength - The maximum length of the truncated string.
 * @returns {string} The truncated string with ellipsis if necessary.
 */
function truncate(str, maxLength) {
    if (str.length > maxLength) {
        str = str.substring(0, maxLength - 3) + '...';
    }
    return str;
}


/**
 * Trims leading and trailing spaces from each element in a comma-separated string
 * and adds a single space after each comma.
 *
 * @param {string} string - The comma-separated string to process.
 * @returns {string} - The processed string with leading and trailing spaces removed from each element
 *                     and a single space added after each comma.
 */
function trimAndAddSpaceAfterComma(string) {
    const trimmedStr = string.split(',')
           .map(item => item.trim())
        .join(', ');
    return trimmedStr;
}


export {
    handleUnauthorizedAccess,
    redirectPage,
    remainingCharacters,
    trimAndAddSpaceAfterComma,
    truncate,
}