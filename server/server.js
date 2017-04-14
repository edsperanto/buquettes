const https = require('https');
const request = require('request');
// express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// request handlers
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const qs = require('querystring');
const github = require('octonode');

//GITHUB Auth
const env = require('dotenv').config();
const { CLIENT_ID, CLIENT_SECRET, TOKEN } = process.env;

// const client = github.client();  *keep for later*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());



// session & passport
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// database
const RedisStore = require('connect-redis')(session);
const db = require('./models');
const {User} = db;

// session settings
app.use(session({
	store: new RedisStore(),
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// passport settings
passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log('USERNAME: ', username);
		User.findOne({where: {username}}).then(user => {
			if(user === null) {
				done(null, false, {message: 'bad username'});
			}else{
				bcrypt.compare(password, user.password).then(res => {
					if(res) done(null, user);
					else done(null, false, {message: 'bad password'});
				});
			}
		}).catch(err => console.log('error: ', err));
	}
));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(({id}, done) => {
	User.findOne({where: {id}})
		.then(user => done(null, user));
});

// standard response
const successJSON = {"success": true};
const failJSON = (msg) => ({"success": false, "error": msg});

// routes
const userRoute = require('./routes/user');
const userRouteDependencies = {
	express, bcrypt, saltRounds, passport, 
	User, successJSON, failJSON,
};
app.use('/user', userRoute(userRouteDependencies));

let targetURL_Repo = `https://github.com/login/oauth/authorize?scope=repo&client_id=${CLIENT_ID}`;
// let postURL = `https://github.com/login/oauth/access_token?${qs.stringify(body)}`;

app.get('/callback', ( req, res ) => {
          
  let body = {
    client_id: CLIENT_ID, 
    client_secret: CLIENT_SECRET, 
    code: req.query.code
  };

  request.post(
  { 
    url: `https://github.com/login/oauth/access_token?${qs.stringify(body)}`
    }, function(error, responseHeader, responseBody){
      console.log('responseBody: ', responseBody); //example: access_token=40characters&scope=whateverWeSet&token_type=typically'bearer'
      let accessT = responseBody.substr(13,40) //save in database as access_token. may want to save scope as well!!
    res.send(`your token has been grabbed BRUH!`); //REDIRECT BACK TO APP LOGIN OR WHATEVER
  });
});

// 404 route
app.get('/404', (req, res) => {
	res.send('404 Not Found');
});
app.use((req, res, next) => {
	res.redirect('/404');
	next();
});

// start express server
if(!module.parent) {
	app.listen(PORT, _ => {
		console.log(`You and Port: ${PORT} are connected like soulmates`);
	});
}
