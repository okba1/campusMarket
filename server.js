var express = require('express');
var app = express();
var port = process.env.PORT || 80;
var mongoose = require('mongoose');
var passport = require("passport");
var flash = require("connect-flash");
var path = require("path");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var configDB = require("./config/database.js");
require('./config/passport')(passport);
// configuration 
mongoose.connect(configDB.url);


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', __dirname + "/views");
console.log(__dirname);
app.use(session({secret : 'thismysecrettoken'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes 
require("./app/routes.js")(app, passport);


app.listen(port);
console.log("the magic happens on port : " + port);



app.on('connexion', function(){
  console.log('connexion');
})