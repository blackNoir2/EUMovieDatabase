import { User } from "../user.js";
import { UserSession } from "../database.js";

/**
* Logs the user out by setting their 'isLoggedIn' status to false,
*  saving the user data, and removing the username from session storage.
*/
function logUserOut() {

    let userObj   = new User();
    const session = new UserSession();
    let user    = userObj.getByUsername(session.getSession("username") || "");

    if (user) {
        user.setIsLoggedIn(false);
        user.save();
        session.removeSession("username");
    }
}





export {
    logUserOut,
}