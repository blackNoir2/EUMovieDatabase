import { toggleSpinner }                          from "./utils/display.js";
import { getQuery }                               from "./utils/queryFinder.js";
import { logUserOut }                             from "./utils/logoutHelper.js";
import {handleUnauthorizedAccess, redirectPage }  from "./utils/helper.js";
import { UserSession } from "./database.js";

handleUnauthorizedAccess();


const logoutLink  = getQuery(".logout");
const url         = window.location.pathname.includes("/home.html");

const session     = new UserSession();
const username    = session.getSession("username");



/**

Event listener for the logout link. When clicked, it logs the user out
@param {Event} event - The event object.
*/
logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    logUserOut();

    toggleSpinner(".spinner", ".logout", true, 2000)
  
    redirectPage("login.html", 2000);
    history.replaceState(null, "", "login.html");
  
  })
  

// Display a greeting to the user on the home page
if (username && url) {
  let greeting = getQuery(".greetings");
  greeting.textContent = `Hello, ${username}`;
}
