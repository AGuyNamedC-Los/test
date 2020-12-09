# Giftee

A social media-esque [website](https://gift-ee.herokuapp.com/) that allows you to manage a gift list that can be comprised of multiple items from other online stores. This gift list can also be viewed by other people who search up your username
- Please allow a couple seconds for the website to load.

# Motivation

I thought it would be a lot simpler to have one place to see a person's gift list so that I could buy them something for the holidays. As well as manage my own gift list instead of relying on multiple different websites

# Technological Tools Used

- Javascript
- Nunjucks
- Express
- Heroku
- Knex
- Send Grid
- HTML5
- CSS3

# Github Code Navigation

# Road Map

- ~~finish the home page demo gift list functionality~~
    - ~~add the delete button~~
    - ~~add the apply button~~
    - ~~add links to the footer of the page~~
        - ~~maybe add icons instead of text or both~~
- ~~finish css for the homepage~~
    - make a better footer
- ~~redo the login page~~
- ~~redo the sign up page~~
- ~~redo the profile page~~
- ~~fix the email confirmation code not being sent~~
- ~~fix the email confirmation code not being sent from heroku~~
- ~~added appropriate response pages~~
- ~~redo css for search page~~
- ~~make the email confirmation look prettier~~
- ~~add a "resend email confirmation code" button~~
- ~~clean up backend code~~
    - ~~COMPLETELY overhauled the backend~~
- create a profile settings functionality
    - change username
    - change email
    - add/change a profile picture
    - change password
- add a privacy option for users
- implement a friends/followers list
    - ping users in the friends list when someone has bought an item from your gift list.

# Why The Change in Code?

The main reason why I created an entirely new version of giftee was to completely redo the backend which was previously all stored in one file. Also, the database that I was previously using (nedb) did not work with Heroku, hence the change to Knex. 