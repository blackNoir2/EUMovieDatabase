/**
 * Greeting Page JavaScript
 *
 * This JavaScript file handles the functionality to display the user's name on the navigation bar.
 * The user's name is retrieved from a stored session or local storage and dynamically updated on all pages.
 * It enhances the user experience by providing a personalized greeting.
 *
 * Author: Egbie
 * Created: 05-04-2023
 * Last Modified: 03-06-2023
 */


import { displayMenuWhenClicked } from "./utils/display.js";
import { getQuery }               from "./utils/queryFinder.js";
import { User }                   from "./user.js";
import { UserSession } from "./database.js";


const greetingLink              = getQuery(".greetings-link");
const profileIconLinkSelector   = ".profile-link";
const userMenuSelector          = ".user-menu";

const userObj    = new User();
const session    = new UserSession()
const user       = userObj.getByUsername(session.getSession("username"));


// Shows the user the greeting on the navigation bar whenever they're logged in
if (greetingLink && user.isLoggedIn) {

    const greeting         = `<i class="fa-solid fa-user"></i> Hi, ${user.username} (logged in)`
    greetingLink.innerHTML = greeting;
    
}


// Activates a dropdown menu when the user clicks profile icon or greeting is able to activate a dropdown menu
displayMenuWhenClicked(profileIconLinkSelector, userMenuSelector);
