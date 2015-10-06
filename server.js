var express           = require('express'),
    server            = express(),
    morgan            = require('morgan'),
    ejs               = require('ejs'),
    expressEjsLayouts = require('express-ejs-layouts'),
    bodyParser        = require('body-parser'),
    methodOverride    = require('method-override'),
    mongoose          = require('mongoose')
    session           = require('express-session');

mongoose.connect('mongodb://localhost/express-crud-demo');

var Tweet = mongoose.model("tweet", {
  author: String,
  content: { type: String, maxlength: 140 }
});

server.set('view engine', 'ejs');
server.set('views', './views');

server.use(session({
  secret: "SOME PASSPHRASE TO ENCRYPT",
  resave: true,
  saveUninitialized: true
}));

server.use(morgan('dev'));
server.use(express.static('./public'));
server.use(expressEjsLayouts);
server.use(methodOverride('_method'));
// forms posting to "/action?_method=SOMETHING"

server.use(bodyParser.urlencoded({ extended: true }));

server.use(function (req, res, next) {
  console.log("REQ DOT BODY", req.body);
  console.log("REQ DOT SESSION", req.session);

  next();
});

server.get('/welcome', function (req, res) {
  res.locals.author = undefined;
  res.render('welcome');
});

server.post('/welcome', function (req, res) {
  req.session.authorName = req.body.authorName;
  res.redirect(302, '/tweets')
});

server.use(function (req, res, next) {
  if (req.session.authorName == undefined) {
    res.redirect(302, '/welcome')
  } else {
    res.locals.author = req.session.authorName;
    next();
  }
})

/* Tweet based routes */

server.get('/tweets', function (req, res) {
  Tweet.find({}, function (err, allTweets) {
    if (err) {
      res.redirect(302, '/welcome');
    } else {
      res.render('tweets/index', {
        tweets: allTweets
      });
    }
  });
});

server.post('/tweets', function (req, res) {
  var tweet = new Tweet({
    author: req.session.authorName,
    content: req.body.tweet.content
  });

  tweet.save(function (err, newTweet) {
    if (err) {
      console.log("Tweet rejected");
      res.redirect(302, '/tweets/new');
    } else {
      console.log("New tweet saved!");
      res.redirect(302, '/tweets');
    }
  });
});

server.get('/tweets/:id/edit', function (req, res) {
  var tweetID = req.params.id;

  Tweet.findOne({
    _id: tweetID
  }, function (err, foundTweet) {
    if (err) {
      res.write("YOUR TWEET ID IS BAD");
      res.end();
    } else {
      res.render('tweets/edit', {
        tweet: foundTweet
      });
    }
  });
});

server.patch('/tweets/:id', function (req, res) {
  var tweetID = req.params.id;
  var tweetParams = req.body.tweet;

  Tweet.findOne({
    _id: tweetID
  }, function (err, foundTweet) {
    if (err) {

    } else {
      foundTweet.update(tweetParams, function (errTwo, tweet) {
        if (errTwo) {
          console.log("ERROR UPDATING");
        } else {
          console.log("UPDATED!");
          res.redirect(302, "/tweets");
        }
      });
    }
  });
});

server.delete('/tweets/:id', function (req, res) {
  var tweetID = req.params.id;

  Tweet.remove({
    _id: tweetID
  }, function (err) {
    if (err) {

    } else {
      res.redirect(302, '/tweets');
    }
  });
});

server.get('/tweets/new', function (req, res) {
  res.render('tweets/new');
});

server.get('/authors/:name', function (req, res) {
  var authorName = req.params.name;

  Tweet.find({
    author: authorName
  }, function (err, authorTweets) {
    if (err) {

    } else {
      res.render('authors/tweets', {
        author: authorName,
        tweets: authorTweets
      });
    }
  });
});

server.listen(4321, function () {
  console.log("Up!");
});
