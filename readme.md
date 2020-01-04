## Express Auth - with OAuth

This is some boilerplate code for projects using Auhtorization/Login.  This is barebones node/express app with basic local user authentication, Facebook OAuth, and Github OAuth.  It exists so that i dont have to start from scratch on my projects.

## What it includes

* OAuth for Facebook and Github
* Sequelize user model / migration
* Settings for PostgrSQL
* Passport and passport-local for authentication
* Sessions to keep user logged in between pages
* Flash messages for errors and successes
* Passwords that are hashed with Bcrypt
* EJS Templating and EJS Layouts

### User Model

| Column Name | Data Type | Notes |
| ----------------- | ---------------- | ---------------------------------- |
| id | Integer | Serial Primary Key |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |
| firstname | String | Must be provided |
| lastname | String | - |
| username | String | - |
| email | String | Must be unique / used for login |
| password | String | Stored as hash |
| photoUrl | String | Profile Picture |
| admin | Boolean | Defaults to false |
| bio | Text | - |
| birthday | Date | - |
| facebookId | String | - |
| facebookToken | String | - |
| githubId | String | - |
| githubToken | String | - |

### Default Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | --------------- | ------------------------ |
| GET | / | index.js | Home Page |
| GET | * | index.js | Render error/404 page |
| GET | /auth/login | auth.js | Login Form |
| GET | /auth/signup | auth.js | Signup Form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates user |
| GET | /auth/logout | auth.js | Removes session info |
| GET | /profile | profile.js | Regular User Profile |
| GET | /profile/admin | profile.js | Admin User Profile |
| GET | /profile/repos | profile.js | Grabs user GH repos |

## Steps to Use

#### 1. Clone this repo, but with a different name

```
git clone <repo link> <new name>
```

#### EXTRA STEP

Switch to the `with-oauth` branch!

```
git checkout with-oauth
```

#### 2. Install node modules from package.JSON

```
npm install
```

(or just `npm i` for short)

#### 3. Customize with new project name

Remove default-y stuff. Some areas to consider are:
* Title in `layout.ejs`
* Logo in NavBar
* Description/Repo Link in `package.json`
* Remove boilerplate's README content and replace with new project's readme

#### 4. Create a new database for the new project

```
createdb <new_db_name>
```

#### 5. Update `config.json`

* Change the database name
* Other settings are likely okay, but check username, password, and dialect

#### 6. Check the models and migrations for relevance to your projects needs

For example, if your projects doesnt require a birthday field, then dont keep that in there.

> Delete from both the model and the migration.

#### 7. Run the migrations

```
sequelize db:migrate
```

#### 8. Add a .env file with the following fields

* SESSION_SECRET: Can be any random string; usually a hash in production
* BASE_URL=''
* GITHUB_CLIENT_ID=''
* GITHUB_SECRET=''
* FACEBOOK_CLIENT_ID=''
* FACEBOOK_SECRET=''

> Note: if using OAuth for Facebook and/or Github, switch to the directions on the `with-oauth` branch!!!

#### 9. Run server, make sure it works

```
nodemon
```

or 

```
node index.js
```

#### 10. Create a NEW repository on Github for the new project to live

* Create a new repository on your personal github account (via the GUI)
* Delete the old remote to origin (`git remote remove origin`)
* Add the new repo link as a remote location you can push to (`git remote add origin <new link>`)
* Add, Commit, and Push
    * `git add -A`
    * `git commit -m "Initial Commit"`
    * `git push origin master`


> Note: Dont make commits from your new project to your auth boilerplate.  Keep it PRISTINE for other future projects!