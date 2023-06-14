

import { displayFooterDate, displayMsg, toggleSpinner } from "./utils/display.js";
import { containsInvalidEmailCharacters, 
         doesStringContainSpecialChars,
         isPasswordsAMatch,
         sanitizeInput,
         validateAndClearFieldFromLinksAndUrls }         from "./utils/validators.js";

import { History }                 from "./history.js";         
import { getQuery }                from "./utils/queryFinder.js";
import { LocalStorage }            from "./database.js";
import { handleUnauthorizedAccess, 
        redirectPage, 
        remainingCharacters, }     from "./utils/helper.js";
import { logUserOut}               from "./utils/logoutHelper.js";



import { Movie }         from "./movie.js";
import { User, Profile } from "./user.js";
import { UserSession }   from "./database.js";


handleUnauthorizedAccess();


// Initialise the classes
const logHistory = new History();
const movies     = new Movie();
let profile      = new Profile();



let user      = new User();
const session = new UserSession();

user = user.getByUsername(session.getSession("username"));

sessionStorage.getItem("username")
logHistory.initialize();
movies.initialize();
profile.initialiseDb();


const myProfile = profile.getProfile();


// The selectors for the html elements
const deleteAccountCard = getQuery(".delete-card");
const deleteAccountLink = getQuery(".delete-account");
const editProfileForm   = getQuery("#profile-form");
const emailField        = getQuery("#current-email");
const footer            = "footer .container .copy-right";
const historyLog        = getQuery(".history .wrapper ol");
const logoutLink        = getQuery(".logout");
const message           = ".profile-message";
const passwordField     = getQuery("#profile-old-password");
const saveBtn           = ".save-btn";
const spinner           = ".spinner";
const successMsg        = ".success-message";
const textArea          = getQuery("#about-me");
const UsernameField     = getQuery("#profile-old-username");


displayFooterDate(footer, "Movie database all rights reserved");


/**

Event listener for the logout link.
Listens for the click event on the logout link,
logs the user out.

Also records the logout event in the log history and replaces the history state to prevent the 
user from logging back in via the browser's back button.

@param {Event} event - The event object.
*/
logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    logUserOut();
    toggleSpinner(spinner, ".logout", true)

    // Record the event in the log history
    logHistory.add("You successfully logged out of the application");
    logHistory.save();

    redirectPage("login.html", 2000);

    // Replace the state of history to prevent the user from hitting back and logging back in
    history.replaceState(null, "", "login.html");
});



/**
 * This code block is executed on the "/edit-profile.html" page.
 * It handles the submission of the edit profile form and updates the profile information.
 */
if (window.location.pathname.includes("/edit-profile.html")) {

    // Pre-fill the edit form with the emai, password and the username
    emailField.value    = user.email;
    passwordField.value = user.password;
    UsernameField.value = user.username;

    toggleSpinner(spinner, ".edit-profile-link", true, 2000);


    const instagramField             = getQuery("#instagram");
    const faceBookField              = getQuery("#facebook");
    const tikTokField                = getQuery("#tik-tok");
    const firstnameSelector          = "#firstname";
    const surnameSelector            = "#surname";
    const aboutMeSelector            = "#about-me";
    const newEmailSelector           = "#new-email";
    const profileNewUsernameSelector = "#profile-new-username";




    /**
    Event listener for the DOMContentLoaded event. When the DOM content is fully loaded, this event listener
    populates the form fields with the user details if found otherwise it adds an empty string as the default value.
    */
    document.addEventListener("DOMContentLoaded", () => {

        // Call the function to populate the dropdown
        populateCountryDropdown();

        getQuery(firstnameSelector).value = myProfile.firstName ?? "";
        getQuery(surnameSelector).value   = myProfile.surname ?? "";
        getQuery(aboutMeSelector).value   = myProfile.aboutMe ?? "";
        getQuery("#birthday").value       = myProfile.birthday ?? "";
        getQuery("#gender").value         = myProfile.gender ?? "";
        instagramField.value              = myProfile.instagram ?? "";
        faceBookField.value               = myProfile.faceBook ?? "";
        tikTokField.value                 = myProfile.tikTok ?? "";
        getQuery("#current-email").value  = user.email;


    })

    /**
     * Prevents the insertion of links and image links in specified user profile fields.
     * Attaches event listeners to the fields to block invalid content insertion.
     *
     * @param {string} fieldSelector - The selector of the field to attach the event listener to.
     * @returns {void}
     */
    const fieldSelectors = [

        firstnameSelector,           // First name field
        surnameSelector,             // Surname field
        aboutMeSelector,             // About me field
        profileNewUsernameSelector,  // profile new Username field
    ];

    // Attaches event listeners to specified field selectors to prevent link insertion and check for special characters.
    // For fields like firstname, surname, and profile username, it also checks for the presence of any special characters.
    // If a special character is found, an alert is displayed and the field value is cleared.
    fieldSelectors.forEach((fieldSelector) => {

        validateAndClearFieldFromLinksAndUrls(fieldSelector);

        if (fieldSelector === firstnameSelector || fieldSelector === surnameSelector || fieldSelector === profileNewUsernameSelector) {
            getQuery(fieldSelector).addEventListener("blur", (event) => {
                const string = event.target.value;
                if (doesStringContainSpecialChars(string)) {
                    alert("The field cannot contain any special characters");
                    event.target.value = "";
                }
            });
        }
    });


    /**
     * Validates the birth date entered in the birthday input field.
     * If the birthday is greater than the current date since it is not possible for a person to 
     * be born after the current date, it displays an alert and clears the input value.
     * @param {Event} event - The blur event object.
    */    
    getQuery("#birthday").addEventListener("blur", (event) => {
        const birthday           = getQuery("#birthday").value;
        const [year, month, day] = birthday.split("-").map(Number);
      
        const date         = new Date();
        const currentYear  = date.getFullYear();
        const currentMonth = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
        const currentDate  = date.getDate();
      
        if (year > currentYear || (year === currentYear && month > currentMonth) || (year === currentYear && month === currentMonth && day > currentDate)) {
          alert("Your birth date cannot be greater than the current date");
          event.target.value = "";
        }
      });
      
    // Event listener to prevent the email field from accepting specific special characters: " \" , [ ] < > ( ) "
    // If the entered email address contains any of these special characters, it displays an alert and clears the field.
    getQuery(newEmailSelector).addEventListener("blur", (event) => {
        const email = event.target.value;
        
        if (containsInvalidEmailCharacters(email)) {

            alert(`Invalid email address: contains special characters not allowed. 
                   The following special characters are not allowed in your email address:  " \" , [ ] < > ( )" `);
            event.target.value = "";
        }
    });



    /**
     * Event listener for the 'blur' event on the Instagram field.
     * When the field loses focus, it checks if the entered URL is a valid Instagram link.
     * If not, it disables the enter key, alerts the user about the correct format, and clears the field.
     *
     * @param {Event} event - The blur event object.
     */
    instagramField.addEventListener("blur", (event) => {
        const url = event.target.value;

        if (url && !isInstagramLink(url)) {
            disableEnterKey();  // Disable the enter key to prevent the user from submitting an incorrect URL when Enter is pressed
            alert("The link should be in the form of Instagram URL, e.g., https://instagram.com/<username>/");
            event.target.value = "";  // Clear the field
        }
    });

    /**
     * Event listener for the 'blur' event on the Facebook field.
     * When the field loses focus, it checks if the entered URL is a valid Facebook link.
     * If not, it disables the enter key, alerts the user about the correct format, and clears the field.
     *
     * @param {Event} event - The blur event object.
     */
    faceBookField.addEventListener("blur", (event) => {
        const url = event.target.value;

        if (url && !isFacebookLink(url)) {
            disableEnterKey();  // Disable the enter key to prevent the user from submitting an incorrect URL when Enter is pressed
            alert("The link should be in the form of Facebook URL, e.g., https://facebook.com/<username>");
            event.target.value = "";  // Clear the field
        }
    });


    /**
     * Event listener for the 'blur' event on the TikTok field.
     * When the field loses focus, it checks if the entered URL is a valid TikTok link.
     * If not, it disables the enter key, alerts the user about the correct format, and clears the field.
     *
     * @param {Event} event - The blur event object.
     */
    tikTokField.addEventListener("blur", (event) => {
        const url = event.target.value;

        if (url && !isTikTokLink(url)) {
            disableEnterKey();  // Disable the enter key to prevent the user from submitting an incorrect URL when Enter is pressed
            alert("The link should be in the form of TikTok URL, e.g., https://tiktok.com/@<username>");
            event.target.value = "";  // Clear the field
        }
    });


    /**
     * Event listener for the 'input' event on the text area.
     * Calculates and displays the remaining characters based on the maximum limit.
     *
     * @param {Event} event - The input event object.
     */
    textArea.addEventListener("input", function (event) {
        remainingCharacters(1000, event.target);
    });


    editProfileForm.addEventListener("submit", (event) => {

        event.preventDefault();
        toggleSpinner(spinner, saveBtn, true, 2000)

        let formEdited = false;

        // form elements after the form is submitte
        let aboutMe            = sanitizeInput(getQuery("#about-me").value);
        let birthday           = sanitizeInput(getQuery("#birthday").value);
        let confirmPassword    = getQuery("#profile-confirm-password").value;
        let facebook           = getQuery("#facebook").value;
        let firstName          = sanitizeInput(getQuery("#firstname").value);
        let gender             = getQuery("#gender").value;
        let instagram          = getQuery("#instagram").value;
        let location           = getQuery("#countries").value;
        let newPassword        = getQuery("#profile-new-password").value;
        let newEmail           = getQuery(newEmailSelector).value;
        let profileNewUsername = getQuery(profileNewUsernameSelector).value;
        let surname            = sanitizeInput(getQuery("#surname").value);
        let tikTok             = getQuery("#tik-tok").value;
      

        // Checks if the data has been changed before storing it in the local database.
        // Saving is allowed if the fields are not empty, except for Instagram, Facebook, YouTube, and TikTok fields.
        if (aboutMe && aboutMe != myProfile.aboutMe) {
            profile.setAboutMe(aboutMe);
            formEdited = true;
        }

        if (birthday && birthday != myProfile.birthday) {
            profile.setBirthday(birthday);
            formEdited = true;
        }

        if (confirmPassword && ifPasswordIsCorrectThen(newPassword, confirmPassword)) {
            formEdited = true;
        }

        if (facebook != myProfile.faceBook) {
            profile.setFaceBook(facebook);
            formEdited = true;
        }

        if (firstName && firstName != myProfile.firstName) {
            profile.setFirstName(firstName);
            formEdited = true;
        }

        if (gender && gender != myProfile.gender) {
            profile.setGender(gender);
            formEdited = true;
        }

        if (instagram != myProfile.instagram) {
            profile.setInstagram(instagram);
            formEdited = true;
        }

        if (location && location != myProfile.location) {
            profile.setLocation(location);
            formEdited = true;
        }

        if (newEmail && newEmail.toLowerCase() != myProfile) {
            setEmail(newEmail.toLowerCase());
            formEdited = true;
        }

        if (surname && surname != myProfile.surname) {
            profile.setSurname(surname);
            formEdited = true;
        }

        if (tikTok != myProfile.tikTok) {
            profile.setTikTok(tikTok);
            formEdited = true;
        }


        if (profileNewUsername && profileNewUsername.toLowerCase() != myProfile.username) {
            setUsername(profileNewUsername.toLowerCase());
            formEdited = true;
        }

   
        // Only save the form if the form has been changed
        if (formEdited) {
            profile.save();

            displayMsg(successMsg, "Successfully saved your details!", "green");

            // record the changes in the log
            logHistory.add("You successfully edited your profile : ");
            logHistory.save();

        } else {
            displayMsg(successMsg, "No data was saved because you didn't make any changes or add any new details", "orange");
        }

    }

    )


}


/**
 * Sets the new username for the user and updates it in the local storage and profile.
 * @param {string} username - The new username entered by the user.
 * @returns {boolean} - True if the username is successfully updated, false otherwise.
 */
function setUsername(username) {
    if (username) {

        username = username.toLowerCase();
        user.setUsername(username);
        user.save();

        sessionStorage.setItem("username", username); // Set the username in session storage
        UsernameField.value = username;               // Update the username field in the form

        // Update the profile and save
        profile.setUsername(username);
        profile.save();
        return true;
    }
}


/**
 * Sets the new email for the user and updates it in the local storage.
 * @param {string} newEmail - The new email entered by the user.
 * @returns {boolean} - True if the email is successfully updated, false otherwise.
 */
function setEmail(newEmail) {
    if (newEmail) {

        // Set the new email for the user
        user.setEmail(newEmail);
        user.save();

        // replace the email field with new entry
        emailField.value = newEmail;

        return true; // Return true to indicate successful email update
    }
}



/**
 * Checks if the new password and confirm password match and updates the user's password.
 * @param {string} newPassword - The new password entered by the user.
 * @param {string} confirmPassword - The confirm password entered by the user.
 * @returns {boolean} - True if the passwords match and the password is successfully changed, false otherwise.
 */
function ifPasswordIsCorrectThen(newPassword, confirmPassword) {

    if (newPassword && confirmPassword) {

        if (!isPasswordsAMatch(newPassword, confirmPassword)) {
            displayMsg(message, "Your passwords do not match", "red");
        } else {
            // Set the new password for the user and save it
            passwordField.value = newPassword;
            user.setPassword(newPassword);
            user.save();

            displayMsg(message, "You have successfully changed your password!", "lightblue");
            return true;
        }
    }
}


/**
 * This code block executes when the current page is "/profile.html".
 * It populates the profile information and social media links.
 */

// Check if the current page is "/profile.html"
if (window.location.pathname.includes("/profile.html")) {

    let displaySocials = false;
    const confirmBtn   = getQuery("#confirm-delete-btn");
    const cancelBtn    = getQuery("#cancel-btn");
    const history      = logHistory.getHistory();

    history.reverse();

    toggleSpinner(spinner, ".profile-icon-link", true, 2000)

    historyLog.innerHTML = "";

    if (history) {

        // When the field is empty a message is displayed to the user, however
        // when the logs are not empty the message is first removed before the log is rendered
        getQuery(".history .wrapper .display-info").style.display = "none";

        // Display the logs entries to the user
        history.forEach((log) => {
            const loggedHistory = `
        
            <li>[+] ${log.msg} on < ${log.time} > </li>
            
            `
            historyLog.appendChild(document.createRange().createContextualFragment(loggedHistory))

        })

    }


    /**
    Event listener for the delete account link.
    Listens for the click event on the delete account link,
    toggles the visibility of the dropdown menu that allows the user to delete the account.
    @param {Event} event - The event object.
    */
    deleteAccountLink.addEventListener("click", (event) => {
        event.preventDefault();

        toggleSpinner(spinner, ".delete-account", true, 500);
        deleteAccountCard.classList.toggle("d-none");
    });


    /**
     * Event listener for the confirm button link
     * Listens for the click event on the modal that ask the user to confirm
     * the deletion of their account and permaneatly deletes the account.
     */
    confirmBtn.addEventListener("click", (event) => {
        event.preventDefault();
        deleteAccountCard.classList.remove("d-none");


        const localStorage = new LocalStorage();

        localStorage.clear();

        toggleSpinner(spinner, "#confirm-delete-btn", true);
        logUserOut();

        displayMsg(".profile-message", "Your account has been permanently deleted!!", "green");
        redirectPage("login.html", 3000);
    })


    /**
     * Event listener for the cancel button 
     * Listens for the click event on the modal that ask the user to confirm or cancel
     * the deletion of their account.
     * This event listener cancels the request to delete that account.
     */
    cancelBtn.addEventListener("click", (event) => {
        event.preventDefault();
        deleteAccountCard.classList.remove("d-none");
    })



    /**
    Event listener for the DOMContentLoaded event. When the DOM content is fully loaded, this event listener
    populates the form fields with the user details if found otherwise it adds a "Not added yet" string.
    */
    document.addEventListener("DOMContentLoaded", () => {

        // Populate profile information from myProfile object if found or adds a not yet if not found
        getQuery(".firstname").textContent     = myProfile.firstName || "Not added yet";
        getQuery(".surname").textContent       = myProfile.surname   || "Not added yet";
        getQuery(".birthday").textContent      = myProfile.birthday  || "Not added yet";
        getQuery(".age").textContent           = calculateAge(myProfile.birthday) || "N/A";
        getQuery(".gender").textContent        = myProfile.gender    || "Not added yet";
        getQuery(".country").textContent       = myProfile.location  || "Not added yet";
        getQuery(".about-me-info").textContent = myProfile.aboutMe   || "Not added yet";
        getQuery(".total-movies").textContent  = movies.totalNumberOfMovies;
        getQuery(".myEmail").textContent       = user.email;
    
        // Populate social media links
        if (myProfile.instagram) {

            displaySocials = true;
            const instagramFieldSelector                   = ".instagram";
            getQuery(instagramFieldSelector).href          = myProfile.instagram;
            getQuery(instagramFieldSelector).style.display = "inline-flex";
        }
        
        if (myProfile.tikTok) {

            displaySocials = true;
            getQuery(".tiktok").href          = myProfile.tikTok;
            getQuery(".tiktok").style.display = "inline-flex"
        }
        if (myProfile.faceBook) {
            displaySocials = true;

            const tikTokSelector                   = ".facebook";
            getQuery(tikTokSelector).href          = myProfile.faceBook;
            getQuery(tikTokSelector).style.display = "inline-flex";
        }

        // If no social media links are available, display a message
        if (!displaySocials) {
            getQuery(".socials-logo").textContent = "Not added yet";
        }
    });
}

/**
 * Checks if a given URL corresponds to an Instagram link.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} - True if the URL is an Instagram link, false otherwise.
 */
function isInstagramLink(url) {
    const instagramRegex = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s/$.?#].[^\s]*$/i;
    return isSocialMediaLink(url, instagramRegex);
}


/**
 * Checks if a given URL corresponds to a Facebook link.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} - True if the URL is a Facebook link, false otherwise.
 */
function isFacebookLink(url) {
    const facebookRegex = /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:\w+)$/i;
    return isSocialMediaLink(url, facebookRegex);
}


/**
 * Checks if a given URL corresponds to a TikTok link.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} - True if the URL is a TikTok link, false otherwise.
 */
function isTikTokLink(url) {
    const tiktokRegex = /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@(?:[\w-]+)$/i;

    return isSocialMediaLink(url, tiktokRegex);
}







/**
 * Helper function that checks if a given URL corresponds to a social media link based on the provided regular expression.
 *
 * @param {string} url - The URL to check.
 * @param {RegExp} regexExpression - The regular expression to match the social media URL.
 * @returns {boolean} - True if the URL is a link for the specified social media, false otherwise.
 */
function isSocialMediaLink(url, regexExpression) {
    return regexExpression.test(url);
}



/**
 * Disables the Enter key functionality by preventing the default behavior of the keydown event.
 */
function disableEnterKey() {
    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    });
}

/**
 * Calculates the age based on the birthday.
 * If the birth year is provided, it calculates the age and returns it.
 * @param {string} birthday - The birth year in the format "YYYY-MM-DD".
 * @returns {number} The calculated age.
 * @throws {Error} If an invalid or empty birthday is provided.
 */
function calculateAge(birthday) {
   
    if (!birthday || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
       return null;
    }
  
    const [year, month, day] = birthday.split("-").map(Number);
    const currentDate        = new Date();
    const currentYear        = currentDate.getFullYear();
    const currentMonth       = currentDate.getMonth() + 1;
    const currentDay         = currentDate.getDate();
  
    let age = currentYear - year;
  
    if (currentMonth < month || (currentMonth === month && currentDay < day)) {
      age--;
    }
  
    return age;
  }
  

async function loadCountries() {
    const response = await fetch('countries.txt');
    const data = await response.text();
    return data.split('\n');
}


function populateCountryDropdown() {
    // Load the countries
    loadCountries()
        .then(countries => {
            // Get the dropdown element
            const dropdown = getQuery("#countries");

            // Iterate over the countries array and create an option element for each country
            for (let i = 0; i < countries.length; i++) {
                const option  = document.createElement("option");
                option.text   = countries[i];
                option.value  = countries[i];

                if (myProfile.location.toLocaleLowerCase() === countries[i].toLocaleLowerCase()) {
                    option.selected = true;
                }

                dropdown.add(option);
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
