# Movie App

The Movie App is a web application that operates a little like IMBD but except on a much smaller scale. The application
allows the user to add a movie, series, etc to the application along with the title, description, cast, rating, length of
the movie and the year it was made. Once added the user of the application can view the movie or delete the movie.


## Features

- **Movie Catalog**: Browse and search for movies.
- **Movie Details**: View detailed information about a movie, including its plot, cast, and reviews.
- **User Authentication**: Create an account, log in.
- **Manage your account**: Manage your profile by changing your password or editing, modifing or adding an existing data.
- **ADD movies, TV series, etc**: Add any movie, series to the application.
- **Delete account**: Delete you account.


## Technologies Used

- Frontend: HTML, CSS, JavaScript, 
- Database: localStorage
- User Authentication: Session JS


## User Registration

To register as a user on the Movie App, follow these steps:

1. Access the registration page by clicking on the "Not signed up click here?" on the login page.
2. Fill in the required information, such as:
   - Username: Choose a unique username for your account.
   - Email: Provide a valid email address.
   - Password: Create a strong password for your account.
   - Confirm password
3. Click the "Register" button to submit the registration form.
4. If the registration is successful, you will be redirected to the login page.
5. Proceed to log in using your newly created credentials.


## User Login

To log in to the Movie App, follow these steps:

1. Access the login page by clicking on the "Login" or "Sign In" button on the homepage.
2. Enter your registered username or email and password in the respective fields.
3. Click the "Login" or "Sign In" button to submit the login form.
4. If the credentials are correct, you will be logged in and redirected to the homepage or your account dashboard.
5. From there, you can access all the features and functionalities of the Movie App.


## Forgotten Password

If you have forgotten your password for the Movie App, follow these steps to reset it:

1. On the login page, click on the "Forgot Password?" link.
2. You will be redirected to the password reset page.
3. Enter the email address associated with your account.
4. Click the "Reset Password" button to submit the password reset request.
5. If you email is successful you will be presented with a new form to change your password.
6. Enter your password.
7. You will be redirected to a page where you can enter a new password.
8. Enter your new password and confirm it.
9. Click the "Reset Password" button to update your password.
10. Once the password is successfully reset, you will be redirected to the login page.
11. Log in to the Movie App using your new password.



## Navigating the application using the profile menu

To move around the application you can do it through the profile menu on the navigation bar

1. Once you logged in you will be presented on the top right hand corner of navigation bar with a greeting that states "<Hi, <your username>, (logged in)>
2. Click on that greeting.
3. You will be presented with three options
   1. My Profile
   1. Edit Profile
   1. Logout
4. Using this you can navigate to anywhere on the page



## Navigating the application using the home page

To move around the application you can do it through the home page 

1. Once you log in you will be taken to the home page
1. Once at the home page you will be presented with three options
   1. Add movie
   1. My Account
   1. Log out user
1. To get to home page you can click the movie icon on the left handside of the page from any page and you will be taken to the home page instantly.


## Add personal details to the application

The application also allows the user to be able to add or update their details e.g username, email, etc for the application:

1. Once you have logged into the application .
2. Look for the field that states titled "Hi, <your username> (logged in) and click it.
3. A dropdown menu will appear with three options.
   1. My Profile
   1. Edit Profile
   1. Logout user
4. Click on the edit profile and you will be redirected to the page with a form that enables you to add or update your details.
5. The form will only save if your new details has been added or the previous data has changed.
6. If you try to save without updating the form either by adding or appending any new detail you will be presented with a message stating ""No data was saved because you didn't make any changes or add any new details""
7. If you have made changes to the form you will be presented with a message telling that you have successfully saved your data.

## Add movie

To add movies to the Movie App, follow these steps:

1. Click on the "Add movie" located on the navigation bar for the index page of the home page.
1. Fill in the required information for the movie, such as:
   - Title: The title of the movie.
   - Description: A brief summary or description of the movie.
   - Rating: The rating or average user rating for the movie.
   - Year: The release year of the movie.
   - Cast: The main cast members or actors in the movie.
1. Click the "Save" or "Submit" button to add the movie to the catalog.


## Viewing Movies

To view the added movies in the Movie App, follow these steps:

1. Access the movie catalog by navigating to the "Movies" section.
2. Browse the movies by you have added.
3. Click on a movie card button labelled "View movie" to view its details page.
4. On the movie details page, you can see the movie's title, description, rating, release year, cast, and other relevant information.


## Deleting Movies

To delete a movie from the Movie App, follow these steps:

1. Navigate to the "Movie Management" section.
3. Locate the movie you want to delete from the movie catalog.
4. Click on the movie to open its details page.
5. On the movie details page, look for the "Delete"  button.
6. Click the "Delete" button to initiate the deletion process.
7. Confirm the deletion when prompted.
8. The movie will be permanently removed from the movie catalog.
9. Additional you can just delete the movie from list of movies by clicking the delete button, confirm you want to delete and the movie will be deleted permanently.


## Viewing Profile

To view your profile:

1. Navigate to your profile either through the home page or the dropdown menu in the navigation bar.
2. If you are navigating through the navigation bar click on the greeting "Hi, <your username> (logged in)"
   1. Click my Profile on the dropdown menu to view your details
3. If you are navigating through the home page click on "my account"


## Editing your Profile

To edit your profile:

1. Navigate to your edit profile either through the home page or the dropdown menu in the navigation bar.
2. If you are navigating through the navigation bar click on the greeting "Hi, <your username> (logged in)"
   1. Click on edit profile on the dropdown menu to edit your details
3. If you are navigating through the home page click on "my account" and once on the profile page page click "edit"


## Deleting your account

To delete your account

1. Navigate to my profile either through the navigation bar or home page by clicking on "Hi, <your username> (logged in)"
1. Click on delete
3. Confirm that you want to delete your account

## Possible Feature Additions (Not Implemented due to Time Constraints)

1. The ability to edit a movie instead of just be able to delete it.
2. Add a genre field
3. The ability to search by ratings, runtime, title, year
4. A search bar that uses live search displaying the movies based on the letters that the user has added for the title
5. Add tags to a movie
6. Search movies by tags
7. A pagination of some sort so when the user clicks "show more movies" to display more movies instead of it being displayed all at once.
8. A profile image
9. A hash function that encrypts the password before storing it in local storage. Currently, the password is stored as plain text.
10. The ability to lock the user out for a certain period of time for exceeding the maximum number of login attempts
11. Enforce a strong password by providing feedback to the user if they have a weak password.

## Limitations

### Limitation on Multiple Accounts

The app currently has a limitation when it comes to multiple accounts. It does not support creating multiple accounts within the same browser. This means that you can only create one account per browser session.

To create multiple accounts, follow these steps:

1. Open a different browser (e.g., Chrome, Safari) that you haven't used for the movie app.
2. Access the movie app using the new browser.
3. You can now create a separate and independent account in the new browser.

Please note that if you try to create another account within the same browser, the application will not allow it. It will provide a pop-up alert for you to delete the existing account before proceeding. You will need to use a different browser to create additional accounts.

Deleting an Account:
If you need to delete an account while registering a new one, the application provides a pop-up alert that allows you to do so. Follow the on-screen instructions in the pop-up alert to delete the account.


This site is hosted using Netlify instead of GitHub Pages due to the structure of the application. GitHub Pages requires starting from the index page and working outwards, which doesn't align with the design of the site. Netlify works more effectively and aligns with the intended design.
   

