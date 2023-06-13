import { getQuery } from "./queryFinder.js";


/**
* Sets the footer content to display the current year and an optional message.
*
* @param {string} selector - The CSS selector for the footer element.
* @param {string|null} [message=null] - An optional message to display next to the year.
* @returns {void}
*/
function displayFooterDate(cssSelector, message = null) {
 
    const footer      = getQuery(cssSelector);
    const currentYear = new Date().getFullYear();
  
    if (message) {
      footer.innerHTML = `&copy; ${currentYear} ${message}`;
    } else {
      footer.innerHTML = `&copy; ${currentYear}`;
    }
  
  }


/**
 * Displays a menu when a profile link is clicked.
 *
 * @param {string} navProfileLinkSelector - The selector for the profile icon in the navigation.
 * @param {string} menuToDisplay - The selector for the menu to display.
 */
function displayMenuWhenClicked(navProfileIconSelector, menuToDisplay) {

    const profileLink = getQuery(navProfileIconSelector);
    const userMenu    = getQuery(menuToDisplay);
  
    if (profileLink) {
    
      profileLink.addEventListener("click", (event) => {
  
        event.preventDefault();
        let resp = userMenu.classList.toggle("show");
  
        if (resp) {
          
          profileLink.style.color  = "darkorange";
          profileLink.style.border = "2px solid orange";
          userMenu.style.border    = "3px solid orange";
        } else {
          profileLink.style.color  = "white";
          profileLink.style.border = "0";
          profileLink.style.border = "0";
          userMenu.style.border    = "0";
        }
      });
    }
  }
  
  
/**
 * Display a message in a specified message div for a given time interval.
 *
 * @param {string} cssSelector - The selector that contains the message within the div
 * @param {string} message - The message to display
 * @param {string} [background="lightgreen"] - The color for the background of the message
 * @param {number} [secondsToDisplay=3000] - The number of seconds for the message to be displayed
 */
function displayMsg(cssSelector, message, background = "lightgreen", secondsToDisplay = 3000) {
    
    const messageDiv = getQuery(cssSelector);
    
    // display the message
    messageDiv.style.display    = "block";
    messageDiv.textContent      = message;
    messageDiv.style.background = background;
    
    // hide message after a given interval has elasped
    setTimeout(function () {
      messageDiv.style.display = "none";
    }, secondsToDisplay);
  }
  


/**
 * Shows or hides a spinner and enables/disables a button.
 * 
 * @param {string} spinnerSelector - The selector for the spinner element.
 * @param {string} btnSelector - The selector for the button/link element.
 * @param {boolean} show - Specifies whether to show or hide the spinner and disable/enable the button.
 * @param {number} secondsToDisplay - Optional. The duration in milliseconds to display the spinner before hiding it.
 */
function toggleSpinner(spinnerSelector, btnSelector, show, secondsToDisplay = 4000) {
  
  let spinner = getQuery(spinnerSelector);
  let btn     = getQuery(btnSelector);

  if (spinner && btn) {

    if (show) {
      spinner.style.display = "block";
      btn.disabled          = true;

      if (secondsToDisplay > 0) {
          setTimeout(function () {
            toggleSpinner(spinnerSelector, btnSelector, false);
        }, secondsToDisplay);
      }
    } else {

        spinner.style.display = "none";
        btn.disabled          = false;
    }
  }
}

export {
    displayFooterDate,
    displayMenuWhenClicked,
    displayMsg,
    toggleSpinner,
}