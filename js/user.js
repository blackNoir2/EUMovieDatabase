import { LocalStorage } from "./database.js";
import { generateID }   from "./utils/generators.js";



/**
 * Represents a user profile.
 */
class Profile {
    #data;
    #database;

    constructor() {
        const storageName = "profile";
        this.#database    = new LocalStorage(storageName);
        this.#data        = this.getData();

        // Initialize profile properties
        this.username  = null;  
        this.firstName = null;
        this.surname   = null;
        this.aboutMe   = null;
        this.birthday  = null;
        this.gender    = null;
        this.location  = null;
        this.instagram = null;
        this.tikTok    = null;
        this.faceBook  = null;

       
    }

    /**
     * Initializes the profile object in the localStorage if it doesn't already exist.
     *
     * This method creates an empty profile object within the localStorage if the profile object does not already exist.
     * The profile object contains properties such as username, firstName, surname, aboutMe, birthday, gender, location,
     * tikTok and faceBook.
     *
     * @returns {boolean} - Returns true to indicate that the initialization was successful.
     */
    initialiseDb() {
       const profileData = {
            "username"  : sessionStorage.getItem("username") || "",
            "firstName" : "",
            "surname"   : "",
            "aboutMe"   : "",
            "birthday"  : "",
            "gender"    : "",
            "location"  : "",
            "tikTok"    : "",
            "faceBook"  : "",
            "instagram" : "",
       }
       
       const existingData = this.#database.getData();
       if (!existingData) {
            this.#database.saveData(profileData);
       }
       return true;
    }

    /**
     * Sets the username for the profile.
     * @param {string} username - The username to be set.
     */
    setUsername(username) {
        this.username = username;
        this.#data.username = this.username;
    }

    /**
     * Sets the first name for the profile.
     * @param {string} firstName - The first name to be set.
     */
    setFirstName(firstName) {
        this.firstName = firstName;
        this.#data.firstName = this.firstName;
    }

    /**
     * Sets the surname for the profile.
     * @param {string} surname - The surname to be set.
     */
    setSurname(surname) {
        this.surname = surname;
        this.#data.surname = this.surname;
    }

    /**
     * Sets the 'about me' information for the profile.
     * @param {string} aboutMe - The 'about me' information to be set.
     */
    setAboutMe(aboutMe) {
        this.aboutMe = aboutMe;
        this.#data.aboutMe = this.aboutMe;
    }

    /**
     * Sets the birthday for the profile.
     * @param {string} birthday - The birthday to be set.
     */
    setBirthday(birthday) {
        this.birthday = birthday;
        this.#data.birthday = this.birthday;
    }

    /**
     * Sets the gender for the profile.
     * @param {string} gender - The gender to be set.
     */
    setGender(gender) {
        this.gender = gender;
        this.#data.gender = this.gender;
    }

    /**
     * Sets the location for the profile.
     * @param {string} location - The location to be set.
     */
    setLocation(location) {
        this.location = location;
        this.#data.location = this.location;
    }

    /**
     * Sets the Instagram URL for the profile.
     * @param {string} instagram - The Instagram URL to be set.
     */
    setInstagram(instagram) {
        this.instagram = instagram;
        this.#data.instagram = this.instagram;
    }

    /**
     * Sets the TikTok URL for the profile.
     * @param {string} tikTok - The TikTok URL to be set.
     */
    setTikTok(tikTok) {
        this.tikTok = tikTok;
        this.#data.tikTok = this.tikTok;
    }

    /**
     * Sets the Facebook URL for the profile.
     * @param {string} faceBook - The Facebook URL to be set.
     */
    setFaceBook(faceBook) {
        this.faceBook = faceBook;
        this.#data.faceBook = this.faceBook;
    }

    /**
     * Saves the profile data to the local storage.
     */
    save() {
        this.#database.saveData(this.#data);
    }

    /**
     * Retrieves the profile data from the local storage and returns a profile instance.
     * @returns {Profile|null} - The profile instance if data is available, null otherwise.
     */
    getProfile() {
        let data = this.#database.getData();

        if (data) {
            const profile = new Profile();
            // Set the profile properties from the retrieved data
            profile.setUsername(data.username);
            profile.setFirstName(data.firstName);
            profile.setSurname(data.surname);
            profile.setAboutMe(data.aboutMe);
            profile.setBirthday(data.birthday);
            profile.setGender(data.gender);
            profile.setLocation(data.location);
            profile.setInstagram(data.instagram);
            profile.setTikTok(data.tikTok);
            profile.setFaceBook(data.faceBook);

            profile.save();

            return profile;
        }

        return null;
    }

    /**
     * Retrieves the profile data from the local storage.
     * @returns {Object} - The profile data object.
     */
    getData() {
        return this.#database.getData() || {};
    }
}



/**
 * Class representing a user and their data.
 */
class User {
    #data;
    #database;
    /**
     * Creates an instance of User.
     */
    constructor() {
        // The key to use when saving the user data to LocalStorage
        const StorageName  = "user"
        this.#database     = new LocalStorage(StorageName);
        this.isLoggedIn    = null;
        this.email         = null;
        this.password      = null;
        this.username      = null;
        this.#data         = this.getData();
    }


    /**
     * Sets the user's login status.
     *
     * @param {boolean} status - The new login status.
     */
    setIsLoggedIn(status) {
        this.isLoggedIn = status;
        this.#data.isLoggedIn = this.isLoggedIn;
    }

    /**
     * Sets the user's email address.
     *
     * @param {string} email - The new email address.
     */
    setEmail(email) {
        
        this.email = email.toLowerCase();
        this.#data.email = this.email;
     
    }

    /**
     * Sets the user's username.
     *
     * @param {string} username - The new username.
     */
    setUsername(username) {
       
        this.username = username.toLowerCase();
        this.#data.username = this.username;
      
    }

    /**
     * Sets the user's password.
     *
     * @param {string} password - The new password.
     */
    setPassword(password) {
        this.password = password;
        this.#data.password = password;
     
        
    }

    /**
     * Returns the user object for a given username.
     *
     * @param {string} username - The username to search for.
     * @returns {User} The user object if found, otherwise null.
     */
    getByUsername(username) {
        let data = this.#database.getData();

        if (data && username && data.username === username.toLowerCase()) {
            return this.#toObject(data);
        }
     
    }

    /**
     * Returns the user object for a given email address.
     *
     * @param {string} email - The email address to search for.
     * @returns {User} The user object if found, otherwise null.
     */
    getByEmail(email) {
        let data = this.#database.getData();

        if (data && data.email === email.toLowerCase()) {
            return this.#toObject(data);
        }
     
    }

    /**
     * Returns a new User object based on the provided data.
     *
     * @private
     * @param {object} data - The user data.
     * @returns {User|null} The new User object if the data is valid, otherwise null.
     */
    #toObject(data) {
        if (data) {
          const user = new User();
          user.setIsLoggedIn(data.isLoggedIn);
          user.setEmail(data.email);
          user.setUsername(data.username);
          user.setPassword(data.password);
          user.save();
          return user;
        }
        return null;
      }


    /**
     * Returns the user data as a JSON string.
     */
    toJSON() {
        return JSON.stringify({
            isLoggedIn: this.isLoggedIn,
            email     : this.email,
            password  : this.password,
            username  : this.username,
    });
  }
  
  /**
   * Save the movie data to the database
   */
  save(){
        this.#database.saveData(this.#data);
    }

  /**
   * Retrieves the entire movie array for the localStorage if found
   * else returns an empty object
   * @returns the entire movie array or an empty {object}
   */
  getData() {
     return this.#database.getData() || {};
  }
}



/**
 * Represents a user's access to different pages.
 */
class UserAccesPage {
    #database;
    #pages;
    constructor() {
      
        const StorageName = "userAccessPage";
        this.#database    = new LocalStorage(StorageName);
        this.id           = null;
        this.accessPage   = false;
        this.page         = null;
        this.#pages       = this.getPages();
    }

    /**
     * Sets the access status of the current page.
     * @param {boolean} access - The access status of the page.
     */
    setPageAccess(access) {
        this.accessPage = access;
        const page      = this.#getPageHelper(this.page);

        if (page) {
            page.access = access;
            this.save();
        }
    }

    /**
     * Adds a page to the list of accessible pages.
     * @param {string} page - The HTML page to add.
     */
    addPage(page) {
        const data = {
            "id": generateID(),
            "page": page,
            "access": false,
        };

        const existingData = this.getPage(page);

        if (!existingData) {
            this.#pages.push(data);
        }
    }

    /**
     * Gets the page data for the specified HTML page.
     * @param {string} HTMLpage - The HTML page to get the data for.
     * @returns {UserAccesPage|null} - The page data as a UserAccesPage object, or null if not found.
     */
    getPage(HTMLpage) {
        const page = this.#getPageHelper(HTMLpage);
        return this.#toObject(page);
    }

    /**
     * Gets the list of accessible pages.
     * @returns {Array} - The array of pages and their access status.
     */
    getPages() {
        return this.#database.getData() || [];
    }

    #getPageHelper(htmlPage) {
        return this.#pages.find((page) => page.page === htmlPage.toLowerCase());
    }

    /**
     * Saves the current page data to the storage.
     */
    save() {
        this.#database.saveData(this.#pages);
    }

    /**
     * Takes an page object and turns it to a class object
     * @param {object} page 
     * @returns - a {class object}
     */
    #toObject(page) {

        if (page) {
            const userPage      = new UserAccesPage();
            userPage.accessPage = page.access;
            userPage.id         = page.id;
            userPage.page       = page.page;

            return userPage;
        }
        return null;
    }
}


export {Profile, User, UserAccesPage};