/**
 * login.js - Handles user login functionality.
 *
 * This JavaScript file contains functions related to user login, authentication, and login page behavior.
 * It provides the necessary functionality to authenticate user credentials, handle login actions, and manage
 * login-related events.
 *
 * @version   1.0.0
 * @author    Egbie
 * @date      29-04-2023
 * @modified  on 03-06-2023 
 *
 * @requires User - The User class for user-related operations.
 * @requires Redirect - The Redirect module for handling page redirection.
 * @requires FormValidator - The FormValidator module for form validation.
 *

 */


import {
  displayFooterDate,
  displayMsg,
  toggleSpinner
} from "./utils/display.js";
import { History } from "./history.js";
import {
  containsInvalidEmailCharacters,
  doesStringContainSpecialChars,
  isPasswordsAMatch,
  sanitizeInput,
  validateAndClearFieldFromLinksAndUrls
} from "./utils/validators.js";
import { getQuery } from "./utils/queryFinder.js";
import {
  handleUnauthorizedAccess,
  redirectPage
} from "./utils/helper.js";
import { User } from "./user.js"
import { LocalStorage } from "./database.js";
import { UserSession } from "./database.js";


const confirmButtonSelector = "#confirm-delete-btn"
const registrationUsernameSelector = "#register-username";
const registrationPasswordSelector = "#register-password";
const registerEmailSelector = "#register-email";
const registerConfirmPasswordSelector = "#register-confirm-password";
const usernameFieldSelector = "#login-username";


const closeRegistrationForm = getQuery(".registration-close-icon");
const cancelButton = getQuery("#cancel-btn");
const confirmButton = getQuery(confirmButtonSelector);
const deletePopAccountPopAlert = getQuery(".delete-registered-account-alert");
const footerSelector = 'footer .container .copy-right';
const forgottenPasswordLinkSelector = ".forgotten-password-link";
const loginBtn = "#login-btn";
const loginForm = getQuery("#login-form");
const loginUsernameField = getQuery("#login-username");
const registerAccountLink = getQuery(".register-account-link");
const registrationConfirmPassword = getQuery(registerConfirmPasswordSelector);
const registrationForm = getQuery("#registration-form");
const registrationFormDiv = getQuery(".hidden-registration");
const registrationPasswordField = getQuery(registrationPasswordSelector);
const registrationUsernameField = getQuery(registrationUsernameSelector);
const registrationEmailField = getQuery(registerEmailSelector);



const showPassword = getQuery("#show-reg-password");
const spinnerSelector = "#spinner";


displayFooterDate(footerSelector, "Movies Database. All rights");


handleUnauthorizedAccess();

// Initialization of the classess
const logHistory = new History();
const user = new User();
const session = new UserSession();
const dbStorage = new LocalStorage("user");

logHistory.initialize();




const fieldSelectors = [
  registrationUsernameSelector,       // username field
  registrationPasswordSelector,       // password field
  registerConfirmPasswordSelector,    // confirm password
  usernameFieldSelector,              // login username field
];

// Prevent url, links, image links from being inserted into the given fields
fieldSelectors.forEach((fieldSelector) => {
  validateAndClearFieldFromLinksAndUrls(fieldSelector);
})




/**
Event listener activates the spinner when "forgptten password link is clicked"

@param {Event} event - The event object.
*/
getQuery(forgottenPasswordLinkSelector).addEventListener("click", (event) => {
  event.preventDefault();
  toggleSpinner(spinnerSelector, forgottenPasswordLinkSelector, true);
  redirectPage("forgotten-password.html");
})


/**
Event listener for the login submission form.

@param {Event} event - The event object.
*/
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // retrieve the elements from the form and store them into their respectable variables
  //const username = getQuery("#username").value;

  const username = loginUsernameField.value;
  const password = getQuery("#password").value;

  const account = user.getByUsername(username);

  if (account && isPasswordsAMatch(password, account.password)) {

    account.setIsLoggedIn(true);
    account.save();

    session.addSession('username', account.username);

    displayMsg(".login-msg", "You have successfully logged in", "green");

    toggleSpinner(spinnerSelector, loginBtn, true)

    redirectPage("home.html", 2000)

    // Record the entry of the login in the log history
    logHistory.add("A successfully login attempt was made");
    logHistory.save();

    // After successful login, replace the current history entry with the home page
    history.replaceState(null, "", "index.html");


  } else {
    toggleSpinner("#spinner", ".login-btn", true);
    displayMsg(".login-msg", "Your username and password is incorrect", "red");

    // Record the entry of the failed login attempt in the log history
    logHistory.add("An incorrect logging attempt was made to your account");
    logHistory.save();
  }

});



/**
Event listener for the login username field.
Listens for any entry the user adds to field and then
santize the field by checking if it contains any special 
characters or if it contains a link

@param {Event} event - The event object.
*/
loginUsernameField.addEventListener("input", (event) => {

  const string = event.target.value;
  if (doesStringContainSpecialChars(string)) {
    alert("Specials character are not allowed in the username field.")
    event.target.value = "";
  }

})



/**
Event listener for the register account link.
Listens for the registration click and when clicked by
the user it displays the registration form

@param {Event} event - The event object.
*/
registerAccountLink.addEventListener("click", (event) => {

  event.preventDefault();
  registrationFormDiv.classList.add("d-none");

  toggleSpinner(spinnerSelector, ".register-account-link", true);

})



/**
 * Event listener for the input event on the registration email field.
 * Checks if the entered email address contains any special characters that are not allowed,
 * and clears the field and displays an alert if invalid characters are found.
 */

registrationEmailField.addEventListener("input", (event) => {
  const email = event.target.value;

  if (containsInvalidEmailCharacters(email)) {
    alert(`Invalid email address: contains special characters not allowed. 
              The following special characters are not allowed in your email address:  " \" , [ ] < > ( )" `);
    event.target.value = "";
  }
})


// cancel the deletion of the account
cancelButton.addEventListener("click", () => {
  deletePopAccountPopAlert.classList.remove("d-none");

})


// confirm the deletion of the account
confirmButton.addEventListener("click", () => {

  // Hide form and pop alert after the user has successful deleted their account
  registrationFormDiv.classList.remove("d-none");
  deletePopAccountPopAlert.classList.remove("d-none");

  dbStorage.clear();

  toggleSpinner(spinnerSelector, confirmButtonSelector, true);
  displayMsg(".login-msg", "You have successful delete your previous account, you can now create a new one");

})

/**
The event listener for the registration form listens for
the submittion of the form, and when it is submittted 
registers the user details

@param {Event} event - The event object.
*/
registrationForm.addEventListener("submit", (event) => {

  const userData = dbStorage.getData();
  const username = sanitizeInput(getQuery(registrationUsernameSelector).value);
  const email = registrationEmailField.value;
  const password = getQuery(registrationPasswordSelector).value;
  const confirmPassword = getQuery(registerConfirmPasswordSelector).value;

  event.preventDefault();
  
  if (isPasswordsAMatch(password, confirmPassword)) {

    if (userData) {
      deletePopAccountPopAlert.classList.add("d-none");

    } else {

      user.setEmail(email);
      user.setIsLoggedIn(false);
      user.setPassword(password);
      user.setUsername(username);
      user.save();

      // Hide the registration form after the user has registered
      registrationFormDiv.classList.remove("d-none");

      displayMsg(".login-msg", "You have successful registered your details, you can now logged in");

      // log the history of the registration event
      const registrationMsg = "You successfully created an account";
      logHistory.add(registrationMsg);
      logHistory.save();

      toggleSpinner(spinnerSelector, ".register-account-link", true);
    }

  } else {
    alert("The password doesn't match!!!")
  }


})


/**
 * Event listener for the show password checkbox.
 * Toggles the visibility of the password fields when the checkbox is clicked.

*  @param {Event} e - The event object.
 */
showPassword.addEventListener("click", () => {

  if (showPassword.checked) {
    registrationPasswordField.type    = "text";
    registrationConfirmPassword.type  = "text";
  } else {
    registrationPasswordField.type    = "password";
    registrationConfirmPassword.type  = "password";
  }

});


/**
 * Event listener for the close registration form button.
 * Removes the "d-none" class from the registration form which essentials hides the registration form.
 */
closeRegistrationForm.addEventListener("click", () => {
  registrationFormDiv.classList.remove("d-none");
  toggleSpinner(spinnerSelector, ".registration-close-icon", true, 1000)
});



/**
 * Event listener for the registraion username field keyup event.
 * Performs validations on the entered username for the registration form
 *  and prevents invalid input.

* @param {Event} event - The keyup event object.
 */
registrationUsernameField.addEventListener("input", (event) => {

  const string = event.target.value;

  if (doesStringContainSpecialChars(string)) {
    alert("Special characters are not allowed in the field")
    event.target.value = "";
  }


});







