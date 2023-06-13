/**
 * Password Utility Functions
 *
 * This JavaScript file contains utility functions for password-related actions, such as password reset,
 * password validation, and other password-related functionality.
 *
 * Author: Egbie
 * Created: 02-05-2023
 * Last Modified: 04-06-2023
 */

/**
 * Reset Password
 *
 * Resets the user's password.
 *
 * @param {string} email       - The user's email address.
 * @param {string} newPassword - The new password to set.
 * @returns {boolean}          - Returns true if the password is successfully reset, false otherwise.
 * @returns {string}           - If the email is not found informs the user through a message.
 */


import { displayFooterDate, 
        displayMsg, 
        toggleSpinner }            from "./utils/display.js";
import { getQuery }                from "./utils/queryFinder.js";
import {isPasswordsAMatch}         from "./utils/validators.js"
import { User, UserAccesPage, }    from "./user.js";
import { handleUnauthorizedAccess,  
        redirectPage}              from "./utils/helper.js"
import { History }                 from "./history.js";


// Initialise the selector elements
const changePasswordCSS      = ".change-password-msg";
const changePasswordForm     = getQuery("#password-form");
const changePasswordHtmlPage = "/change-password.html";
const resetPasswordBtn       = "#reset-btn";
const footerSelector         = 'footer .container .copy-right';
const forbiddenPage          = "/forbidden.html";
const resetEmailCss          = ".reset-email-msg";
const resetEmailForm         = getQuery("#reset-email-form");
const spinner                = ".spinner";
const userPages              = new UserAccesPage();


displayFooterDate(footerSelector, "Movies Database. All rights");
userPages.addPage(changePasswordHtmlPage);
userPages.save();

const userPage   = userPages.getPage(changePasswordHtmlPage);


const logHistory = new History()
logHistory.initialize();


// Checks if the user has access to view that page - if not redirects them to a forbidden page
// If the user has access then allows the user to change their password via the password form
if (!userPage.accessPage && window.location.pathname.toLowerCase().includes("/change-password.html")) {
  redirectPage(forbiddenPage);
} else {

  if (changePasswordForm) {
    /**
     * The changePasswordForm addEventListeners listens for when the form is submitted
     * and if everything is correct with the form then the details are then saved to the localstorage
     */
    changePasswordForm.addEventListener("submit", (event) => {
      
      event.preventDefault();

      const password                = getQuery("#password").value;
      const confirmPassword         = getQuery("#confirm-password").value;
      const savePasswordBtnSelector = ".save-password-btn";

      if (isPasswordsAMatch(password, confirmPassword)) {
        
        displayMsg(changePasswordCSS, "Your have successfully changed your password");

        // store the new password
        let user = new User()
        user.setPassword(password);
        user.save();

        // log the event in the log history
        logHistory.add("You have successfully changed your password");
        logHistory.save();

        // remove the access to the page to prevent the user from going to the page and changing the password again
        // This page should only be available to the user through the forgotten password page and only when
        // the email is correct
        userPage.setPageAccess(false);
        userPage.save();
      
        toggleSpinner(spinner, savePasswordBtnSelector, true);
      
        redirectPage("login.html", 3000);
      
      } else {

        toggleSpinner(spinner, savePasswordBtnSelector, true);
        displayMsg(changePasswordCSS, "Your password does not match correct", "red");

        // log the failed attempt in the log history
        logHistory.add("You failed to change your password");
        logHistory.save();
      }
    })

  }
}


/**
 * Event listener for the reset email form submission.
 * Listens for the form submission and handles the reset email process.
 * @param {Event} event - The event object.
 */
resetEmailForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = getQuery("#email");
  let user    = new User();

  user = user.getByEmail(email.value.toLowerCase());
  
  if (!user) {

    toggleSpinner(spinner, resetPasswordBtn, true, 4000);
    displayMsg(resetEmailCss, "The email was not found", "red", 4000)

    // log the failed attempt in the log history
    logHistory.add("An attempt was made to change your password but it failed because the email could not be found!");
    logHistory.save();

  } else {

    displayMsg(resetEmailCss, "Successfully, You can now change your password!!!", "green", 4000)

    // log the succesful request in the log history
    logHistory.add("A succesful request was made to change your email");
    logHistory.save();

    // store the correct email inside a session to be accessed in the changePasswordForm addEventListener
    sessionStorage.setItem("email", email.value.toLowerCase()); 

    // set the user access to the page as true
    userPage.setPageAccess(true);
    userPage.save();

    toggleSpinner(spinner, resetPasswordBtn, true, 4000);

    redirectPage(changePasswordHtmlPage, 3000)
  }

});
