import { LocalStorage } from "./database.js";



// Movie Class
/**
 * Class representing a collection of movies.
 */
class Movie {
    
    #storage;
    #movies;

    /**
     * Create a new Movie collection.
     * @param {string} moviesStorageName - The name of the LocalStorage item where the movies are stored.
     */
    constructor(moviesStorageName="movieData") {
      
      this.#storage             = new LocalStorage(moviesStorageName);
      this.#movies              = null;
      this.totalNumberOfMovies  = this.getTotalNumberOfMovies(); // returns
    }
    
    /**
     * Initializes the movies by loading it from the storage.
     * This method should be called when the class is loaded.
     * By initializing the movies when this method is called instead of
     * when the class is first created, it prevents the class from loading
     * the entire history at the start thus improving performance.
     */
    initialize() {
      this.getMovies();
    }

    /**
     * Add a movie to the collection.
     * @param {object} movie - The movie object to add.
     */
    add(movie) {
      this.#movies.push(movie);
    
    }
    
    /**
     * Get a movie from the collection by ID.
     * @param {string} id - The UUID of the movie to retrieve.
     * @returns {object|undefined} - The movie object, or undefined if no movie was found with the given ID.
     */
    getById(uuid) {
      return this.#movies.find((movie) => movie.uuid === uuid);
    }
  
    /**
     * Remove a movie from the collection by ID.
     * @param {string} id - The UUID of the movie to remove.
     * @returns {boolean} - True if a movie was removed, false otherwise.
     */
    removeById(id) {
  
      const index = this.#movies.findIndex(movie => movie.uuid === id);
      const notFound = -1;
      let   removed  = false;
  
      if (index !== notFound) {
        this.#movies.splice(index, 1);
        this.#storage.saveData(this.#movies);
        removed = true;
      }
  
      return removed;
  
    }
  
    /**
     * Get all movies from the collection.
     * @returns {array} - An array of movie objects.
     */
    getMovies() {
      this.#movies = this.#storage.getData() || [];
      return this.#movies;
    }

    /**
     * Gets the number of movies the user has in the local storage
     * @returns {integer} - The number of movies in the local storage
     */
    getTotalNumberOfMovies() {
      return this.getMovies().length;
   
    }

    /**
     * Saves the movies to the storage.
     */
    save() {
      this.#storage.saveData(this.#movies);  
    }
  }
  

  export {Movie};
  



