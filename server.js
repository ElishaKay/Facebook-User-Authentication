var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var expressSession = require('express-session');

var app = express();

app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

passport.use(new FacebookStrategy({
    clientID: 243048499457676,
    clientSecret: "6cd264c24600e41f598802af38dad655",
    callbackURL: "http://localhost:8000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("accessToken:");
    console.log(accessToken);

    console.log("refreshToken:");
    console.log(refreshToken);

    console.log("profile:");
    console.log(profile);

    return done(null, profile);
  }
));


// The conversation taking place between client and facebook
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/facebookCanceled'
  }));

// in case of successful negotiation
// route for showing the profile page
app.get('/profile', function(req, res) {
  console.log(req.user);
  res.render('profile.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

// in case of failure
app.get('/facebookCanceled', function(req, res) {
  res.send("fail!");
});

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.listen(8000);