# Express-Mongo-Twitter

We're going to build a twitter clone in Express and Mongo.  It won't be stylish, but it will have most of the trimmings of a full app, otherwise.

## Phase 1

First we need to setup our overall environment, including installing packages:
- express
- body-parser
- method-override
- ejs
- express-ejs-layouts
And creating directories for ejs templates, and the public views.

## Phase 2

Next we need to:
1. Add in mongoose, and create a model for the Tweets

2. Setup our routes and pages for Create & Read All:
- GET `tweets/new` should be a form for new tweets
- POST `tweets` should create a new tweet
- GET `tweets` should show every tweet made

## Phase 3

Next up we should allow:
1. Deleting a tweet
2. Editing a tweet

## Phase 4

Lastly we would like to:

1.  Viewing all tweets by author name

## Phase 5 - Surprise!

Finally we would like to:

1. Use sessions to set an author, and allow the app to use that persistent author rather than asking your name for each new tweet.
