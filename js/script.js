

import { displayMsg, toggleSpinner } from "./utils/display.js";
import { displayFooterDate } from "./utils/display.js";
import { generateID } from "./utils/generators.js";
import { getQuery } from "./utils/queryFinder.js";
import { Movie } from "./movie.js";
import { History } from "./history.js";
import { handleUnauthorizedAccess, 
         redirectPage,
         remainingCharacters,
         trimAndAddSpaceAfterComma, truncate} from "./utils/helper.js";
import { doesStringContainSpecialChars, sanitizeInput,
         validateAndClearFieldFromLinksAndUrls} from "./utils/validators.js";

// Assign the elements from HTML selector to given fields
const addMovieLink             = getQuery("#add-movie");
const closeAddMovieSideBarForm = getQuery("#close-sidebar-btn");
const editProfile              = getQuery(".edit-profile");
const formSideBar              = getQuery(".form-sidebar");
const footerSelector           = 'footer .container .copy-right';
const movieDisplay             = getQuery("#movies .showcase-display");
const movieCastSelector        = "#cast";
const movieDescriptionSelector = "#plot";
const movieForm                = getQuery("#add-movie-form");
const movieNavLogo             = getQuery(".movie-nav-pic");
const movieTitleSelector       = "#title";
const specialChars             = "!@#$%^&*()_+-={}[]|\\;:'\"<>.?/~";
const textArea                 = getQuery("#plot");
const title                    = getQuery(".h2-movie-title");

// the form fields 
const movieTitleField       =   getQuery(movieTitleSelector);
const movieDescriptionField =   getQuery(movieDescriptionSelector);
const movieCastField        =   getQuery(movieCastSelector);
 

// classes initialization
const logHistory = new History()
const movieList  = new Movie();

logHistory.initialize();
movieList.initialize();

handleUnauthorizedAccess();
displayFooterDate(footerSelector, "Movies Database all rights");

showMovies();
 



// The function when called displays the movies stored in localStorage, with the most recently added movies shown first
function showMovies() {

  const movies = movieList.getMovies();
 
  const isMovieArrayEmpty = (Array.isArray(movies) && movies.length === 0);
  const cardsSection      = document.querySelector(".cards");

  if (!isMovieArrayEmpty) {

    movieDisplay.style.display = "none";
    title.style.display        = "block";
    cardsSection.innerHTML     = ""; // clear the html face to prevent duplication

    toggleSpinner("#spinner", ".add-movie-btn", true, 3000);

    movies.reverse();
    movies.forEach((movie) => {

      // The 'card' fragment represents an individual movie card, including its layout and filled content taken from
      // the movie object
      const card = `
        <div class="card">
          <div class="header">
            <img src="/img/movie2.png" alt="movie image" />
          </div>
          <div class="body">
                      
           <p>${truncate(sanitizeInput(movie.title), 10)}</p>
            <p>${truncate(sanitizeInput(movie.description), 255)}</p>

            <div class="year movie-info"><strong>Year: </strong>${movie.year}</div>
            <div class="runtime movie-info"><strong>Runtime: </strong>${movie.runtime} mins</div>
            <div class="cast movie-info"><strong>Cast: </strong>${movie.cast}</div>
          </div>

          <div class="footer">
            <div class="buttons">
              <a href="details.html?id=${movie.uuid}" class="large-button view-btn" data-movie="${movie.title}"> 
                     <i class="fa-solid fa-street-view"></i>
                    View more
              </a>
              <a href="#" id="${movie.uuid}" class="large-button delete-btn" data-movie="${movie.title}"> 
                    <i class="fa-sharp fa-solid fa-trash"></i> Delete
              </a>
            </div>
          </div>
        </div>
      `;


      // Modal popup that will popup when the user wants to delete a movie
      // The user will have to click on either 'yes' to delete a movie or 'cancel' to
      // not delete
      const cardDeleteAlert = `
        <div class="delete-card movie-card delete-card-${movie.uuid}">
          <h1>Movie deletion confirmation!</h1>
          <h4>This action cannot be reversed once it's done!!!</h4>
          <br>
          <p> Are you sure you want to delete the movie '${movie.title}' with ID '${movie.uuid}'</p>
          <br>
          <br>
          <br>
          <div class="flex-btn">
            <button class="close" id=${movie.uuid}-cancel-btn>Cancel</button>
            <button type="submit" class="confirm" id=${movie.uuid}-delete-btn>Yes</button>
          </div>
        </div>
      `;


      // The 'deleteConfirmationMessage' fragment is displayed when a movie or series is successfully 
      // deleted from the local storage, serving as a confirmation message.
      const deleteConfirmationMessage = `
          <div id="delete-confirmation-message">
            <p>You have successfully deleted a movie from the database</p>
          </div>
        `;

      /**
      * Appends three HTML fragments to the 'cardsSection' element, representing the movie showcase section.
      *
      * The 'card' fragment is a template representing an individual movie card. Each card is dynamically filled 
      * with movie details retrieved from local storage.
      *
      * The 'cardDeleteAlert' fragment is a modal or popup that appears when the user tries to remove a movie. 
      * It provides a confirmation prompt with movie-specific details, allowing the user to confirm or cancel 
      * the deletion.
      *
      * The 'deleteConfirmationMessage' fragment is displayed when a movie or series is successfully deleted 
      * from local storage, serving as a confirmation message.
      *
      * These fragments are created using the 'document.createRange().createContextualFragment()' method. 
      * This method parses HTML code and creates a DOM tree from it. Once the fragments are created, 
      * they are appended to the 'cardsSection' element, which renders them on the screen.
      *
      * Note: 'cardsSection' refers to the specific element in the DOM where the movie cards will be appended,
      *  and it plays a significant role in the movie showcase feature.
      */
      cardsSection.appendChild(document.createRange().createContextualFragment(card));
      cardsSection.appendChild(document.createRange().createContextualFragment(cardDeleteAlert));
      cardsSection.appendChild(document.createRange().createContextualFragment(deleteConfirmationMessage));

      let cancelDeleteAlertPopupBtn  = document.getElementById(`${movie.uuid}-cancel-btn`);
      let confirmDeleteAlertPopupBtn = document.getElementById(`${movie.uuid}-delete-btn`);
      let deleteMovieBtn             = document.getElementById(`${movie.uuid}`);
      let deleteMoviePopupAlert      = getQuery(`.delete-card-${movie.uuid}`);   // The popup screen informing the user to confirm their delete


      /**
       * Adds an event listener to the cancel delete alert button.
       *
       * When the cancel delete alert button is clicked, this event listener is triggered 
       * and removes the 'd-none' class from the 
       * delete movie popup alert, making it invisible to the user.
       *
       * @param {Event} e - The event object representing the click event.
     */
      cancelDeleteAlertPopupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        deleteMoviePopupAlert.classList.remove("d-none");
      });


    /**
      * Adds an event listener to the confirm delete alert button.
      *
      * When the confirm delete alert button is clicked, this event listener is triggered.
      * It removes the movie from the movie list by its ID, shows the updated list of movies, 
      * displays a confirmation message to the user, and logs the deletion event in the log history.
      *
      * @param {Event} e - The event object representing the click event.
     */
      confirmDeleteAlertPopupBtn.addEventListener("click", (e) => {
        e.preventDefault();

        movieList.removeById(movie.uuid);
        deleteMoviePopupAlert.classList.remove("d-none");

         // log the deleted movie in the log history
        logHistory.add(`You deleted a movie with the id ${movie.uuid} and the title "${movie.title}" from your local storage`);
        logHistory.save();

        showMovies();

    
        const msg = "You have successfully deleted a movie from the database";
        displayMsg("#delete-confirmation-message", msg, "red");

       
      });



    /**
     * Adds an event listener to the delete movie button.
     *
     * When the delete movie button is clicked, this event listener is triggered. 
     * The event adds the 'd-none' class which displays the popup alert to the user.
     *
     * @param {Event} e - The event object representing the click event.
     */
    deleteMovieBtn.addEventListener("click", (e) => {
      e.preventDefault();
      deleteMoviePopupAlert.classList.add("d-none");
     
    });


    });

  } else {
    
    movieDisplay.style.display = "block";
    title.style.display        = "none";
    cardsSection.innerHTML     = ""; 
   
  }
}


/**
 * Prevents the insertion of links and image links in specified movie form fields.
 * Attaches event listeners to the fields to block invalid content insertion.
 *
 * @param {string} fieldSelector - The selector of the field to attach the event listener to.
 * @returns {void}
 */

const fieldSelectors = [

  movieCastSelector,
  movieDescriptionSelector,   
  movieTitleSelector         
];

fieldSelectors.forEach((fieldSelector) => {
  validateAndClearFieldFromLinksAndUrls(fieldSelector);
});




// EventListeners 


/**
 * Adds an event listener to the 'Add Movie' link.
 *
 * When the 'Add Movie' link is clicked, this event listener is triggered. 
 * The event toggles the active state of the form sidebar by adding or removing the 
 * 'form-sidebar-active' class when the user clicks on the link.
 *
 * @param {Event} event - The event object representing the click event.
 */
addMovieLink.addEventListener("click", (event) => {
  event.preventDefault();
  formSideBar.classList.toggle("form-sidebar-active");
});




/**
 * Adds an event listener to the 'Close' button in the movie input "form" sidebar.
 *
 * Removes the active state of the form sidebar by removing the 'form-sidebar-active' class. 
 * essentially closing the form. Additionally, it resets the cursor style and opacity 
 * of a specific large button.
 *
 * @param {Event} event - The event object representing the click event.
 */
closeAddMovieSideBarForm.addEventListener("click", (event) => {
  event.preventDefault();

  formSideBar.classList.remove("form-sidebar-active");
  largeButton.style.cursor = "pointer";            
  largeButton.style.opacity = "1";                  
});




/**
 * Adds an event listener to the editProfile element for the click event.
 *
 * When the click event occurs, this event listener redirects the user to the 
 * edit profile page after a delay of 2000 milliseconds.
 */
editProfile.addEventListener("click", (event) => {

  event.preventDefault();
  toggleSpinner("#spinner", ".login", true)

  redirectPage("edit-profile.html", 2000);
});





/**
 * Adds an event listener to the movie form for the submit event.
 *
 * When the form is submitted, this event listener is triggered. It creates a new movie object
 * with input values from the form, adds the movie to the movie list, saves the movie list, 
 * logs the action in the log history, displays a success message, and updates the displayed movies. 
 * Additionally, it resets the form and clears the URL string.
 *
 * @param {Event} event - The event object representing the submit event.
 */
movieForm.addEventListener('submit', (event) => {
  event.preventDefault(); 

  const movie = {
    'uuid'       : generateID(),
    'title'      : movieTitleField.value,
    'description': movieDescriptionField.value,
    'cast'       : trimAndAddSpaceAfterComma(movieCastField.value),
    'runtime'    : getQuery("#runtime").value,
    'rating'     : getQuery("#rating").value,
    'year'       : getQuery("#year").value
  };

  movieList.add(movie);
  movieList.save();

  // log the entry in the logs
  logHistory.add(`You added a movie with the id ${movie.uuid} and the title "${movie.title}" to your local storage`);
  logHistory.save();

  displayMsg(".message", "You have successfully added a movie to the database");
  showMovies();

  // Reset the form and clear the URL string
  history.pushState(null, null, window.location.pathname);
});



/**
 * Adds an event listener to the movie Nav pic logo located at the top left
 *  hand corner of all the pages in the app.
 * 
 * When the click event occurs redirects the user to the home page after a delay of 2000 milliseconds.
 */
movieNavLogo.addEventListener("click", (event) => {

  event.preventDefault();
  toggleSpinner("#spinner", ".logout", true);
  redirectPage("home.html", 2000);
});



/**
 * Adds an event listener to the TextArea element for the input event.
 *
 * When the input event occurs, this event listener uses the `remainingCharacters` function 
 * to determine the number of characters remaining in real time for the plot description. 
 * It passes the maximum character limit of 600 and the TextArea element as 
 * arguments to the `remainingCharacters` function.
 */
movieDescriptionField.addEventListener("input", function () {
  remainingCharacters(600, movieDescriptionField);
});









/**
  Event listener for the keyup event on the movie title field.
 * Validates the input in real-time and restricts the use of special characters
 * in the movie title field with the exception of commas, full stops, hyphens, and apostrophes. 
 * If an invalid character is entered, it displays an alert
 * and removes the last character from the field.
 * @param {Event} event - The 'blur' event object.
 */
movieTitleField.addEventListener("blur", (event) => {

  const specialCharactersNotAllowed = "!@#$%^&*()_+={}[]|\\;:\"<>?/~"; // special characters containg no commas, full stops, hyphens, and apostrophes since they are allowed in the title
  const string       = event.target.value;
  const alertMsg     = "Only commas, full stops, hyphens, and apostrophes are allowed in the title, nothing else.";
  
  if (doesStringContainSpecialChars(string, specialCharactersNotAllowed)) {
    alert(alertMsg);
    event.target.value = "";
  }

});



/**
 * Event listener for the 'paste' event on the movie cast field.
 * Checks if the pasted string contains any special characters and clears the field if found.
 * 
 * The field is not cleared if it contains commas since the names are separated by commas
 *
 * @param {Event} event - The 'paste' event object.
 */
movieCastField.addEventListener("blur", (event) => {
 
  const specialCharactersNotAllowed = "!@#$%^&*()_+={}[]|\\;:\"'<>?/~-";  // doesn't contain the special character comma
  const string       = event.target.value;

  if (doesStringContainSpecialChars(string, specialCharactersNotAllowed)) {
  
    const alertMsg = "The string you pasted contains special characters and only commas is allowed";
    alert(alertMsg);
    event.target.value = "";
      
  }
  
});








