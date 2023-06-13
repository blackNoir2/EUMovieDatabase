/**
 * File Name: details.js
 * Description: This JavaScript file contains functions and utilities for displaying movie details on the details page.
 * It provides the necessary functionalities to fetch and render movie details based on user interactions and API calls.
 * Author: Egbie
 * Created: 05-04-2023
 * Last Modified: 03-06-2023
 */

import { redirectPage }           from "./utils/helper.js";
import { displayFooterDate, 
         displayMsg }             from "./utils/display.js";
import { getQuery }               from "./utils/queryFinder.js";
import { Movie }                  from "./movie.js";


// retrieve the movie url, strip the id from it and then using only the id retrieve the movie
const params      = new URLSearchParams(window.location.search);
const id          = params.get('id');
const movieList   = new Movie();
const movie       = movieList.getById(id);

 
const cancelDeletePopAlert  = getQuery("#cancel-btn");
const confirmDeletePopAlert = getQuery("#confirm-delete-btn");
const deleteButton          = getQuery(".delete-button");
const deleteCardPopAlert    = getQuery(".delete-card");
const footerSelector        = 'footer .container .copy-right';
const goBackButton          = getQuery(".go-back");


displayFooterDate(footerSelector, "Movies Database. All rights")

// if the id of the movie is not found redirect to a 404 page
if (!movie) {
    redirectPage("404.html")
}


// Assign the details of the movie to given html fields so they are available for the user at details.html page
getQuery("#movie-cast").textContent         = `Cast: ${ifArrayChangeToString(movie)}`;
getQuery("#movie-description").textContent  = movie.description;
getQuery("#movie-title").textContent        = movie.title;
getQuery("#movie-runtime").textContent      = `Runtime: ${movie.runtime}`;
getQuery("#movie-year").textContent         = `Release Year: ${movie.year}`;



// event listeners

/**
 * Event listener for the cancel delete button. When the pop alert is shown to the user
 * with the options to either confirm or delete the movie, series, etc this event listener
 * allows the user to cancel the deletion of the movie, series, etc
 * @param {Event} event - The event object.
 */
cancelDeletePopAlert.addEventListener("click", (event) => {
    event.preventDefault();
    deleteCardPopAlert.classList.remove("d-none");
});


/**
 * Event listener for the confirmation of the delete button. When the pop alert is shown to the user
 * with the options to either confirm or delete the movie, series, etc this event listener
 * deletes the movie or series from the localstorage.
 * @param {Event} event - The event object.
 */
confirmDeletePopAlert.addEventListener("click", (event) => {
    event.preventDefault();
    movieList.removeById(id);
    redirectPage("index.html");
    displayMsg(".message", "You have successfully deleted a movie", "red");

})


/**
 * Event listener for the delete button. The event listens for a "click" and when it
 * is clicked it presents the user a modal with two options "confirm" or "cancel"
 * @param {Event} event - The event object.
 */
deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    deleteCardPopAlert.classList.toggle("d-none");
})




/**
 * Function to navigate back to the previous page in the browsing history.
 * It utilizes the `window.history.back()` method to achieve this.
 */
goBackButton.addEventListener("click", (event) => {
    event.preventDefault();
    window.history.back();

})


/**
 * Converts the cast property of a movie to a string.
 * If the cast property is an array, it joins the elements with a comma separator.
 * If the cast property is not an array, it returns the cast property as is.
 * @param {Object} movie - The movie object.
 * @returns {string} - The cast property as a string.
 */
function ifArrayChangeToString(movie) {
    let castString = "";

    if (Array.isArray(movie.cast)) {
        castString = movie.cast.join(", ");
    } else {
        castString = movie.cast;
    }
    return castString;
}



 






