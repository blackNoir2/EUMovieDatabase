/**
 * The LocalStorage class provides methods to interact with the local storage. 
 * It allows you to set data, retrieve data, save data, and clear the local storage. 
 */

class LocalStorage {
  /**
   * @param {string} storageName - The name of the local storage.
   */
  constructor(storageName) {
    this.storageName = storageName;
    this.data = null;
  }

  /**
   * Sets the data of the LocalStorage instance.
   * @param {object} data - The data to set.
   */
  setData(data) {
    this.data = data;
  }

  /**
   * Retrieves the data from the local storage.
   * @returns {object} The data from the local storage.
   */
  getData() {
    return JSON.parse(localStorage.getItem(this.storageName));
  }

  /**
   * Saves data to the local storage.
   * @param {object} dataToSave - The data to save.
   */
  saveData(dataToSave) {
    localStorage.setItem(this.storageName, JSON.stringify(dataToSave));
  }

  /**
   * Clears the local storage and the session storage.
   */
  clear() {
    
    if (localStorage.getItem("history")) {
      localStorage.removeItem("history");
    }

    localStorage.clear();
    sessionStorage.clear();
  }
}


/**
 * Manages the user session by storing session data persistently across all tabs.
 */
class UserSession {
  /**
   * Adds a session value to the storage.
   *
   * @param {string} sessionName - The name of the session.
   * @param {string} sessionValue - The value of the session.
   */
  addSession(sessionName, sessionValue) {
    localStorage.setItem(sessionName, sessionValue);
  }

  /**
   * Retrieves a session value from the storage.
   *
   * @param {string} sessionName - The name of the session to retrieve.
   * @returns {string|null} - The value of the session, or null if not found.
   */
  getSession(sessionName) {
    return localStorage.getItem(sessionName);
  }

  /**
   * Removes a session value from the storage.
   *
   * @param {string} sessionName - The name of the session to be removed.
   */
  removeSession(sessionName) {
    localStorage.removeItem(sessionName);
  }
}


export {LocalStorage, UserSession};
  
  