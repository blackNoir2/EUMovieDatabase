/**
 * History JavaScript
 *
 * This JavaScript file manages the logging of user activities, such as login, registration,
 * and changes to user information (email, password, username). It keeps track of important events
 * and provides a historical record of user actions for auditing and analysis purposes.
 *
 * Author       : Egbie
 * Created      : 05-04-2023
 * Last Modified: 03-06-2023
 */

import { LocalStorage } from "./database.js";
import { generateID }   from "./utils/generators.js"



/**
 * History class that manages the user's activity history.
 * It provides methods to add new entries to the history,
 * retrieve the entire history, and save the history to the storage.
 */
class History {
    #history;
    #storage;

    /**
     * Creates a new History instance.
     * @param {string} storageName - The name of the storage to use.
     */
    constructor(storageName = "history") {
        this.#storage = new LocalStorage(storageName);
        this.#history = null;
    }

   /**
     * Initializes the history by loading it from the storage.
     * This method should be called when the class is loaded.
     * By initializing the history when this method is called instead of
     * when the class is first created, it prevents the class from loading
     * the entire history at the start thus improving performance.
     */
    initialize() {
        this.getHistory();
    }

    /**
     * Adds a new entry to the history.
     * @param {string} message - The message to add to the history.
     */
    add(message) {
        const log = {
            "id": generateID(),
            "msg": message,
            "time": this.#getTimeAndDate(),
        };
        this.#history.push(log);
    }

    /**
     * Gets the entire history.
     * @returns {Array} - The array containing the history entries.
     */
    getHistory() {
        this.#history = this.#storage.getData() || [];
        return this.#history;
    }

    /**
     * Saves the history to the storage.
     */
    save() {
        this.#storage.saveData(this.#history);
    }

    /**
     * Returns the current date and time as a formatted string.
     * @returns {string} - The formatted date and time string.
     */
    #getTimeAndDate() {
        const date     = new Date();
        const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const time     = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        
        return `${fullDate} ${time}`;
    }
}


export {History}