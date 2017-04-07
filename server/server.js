// express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// request handlers
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const github = require('octonode');

//GITHUB Auth
const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;
const client = github.client();

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
const sequelize = require('sequelize');
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
		User.findOne({where: {username: username}}).then(user => {
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


// routes
let userRoute = require('./routes/user');
app.use('/user', userRoute(express, bcrypt, passport, User));

client.get('/users/edsperanto', ( err, status, body, headers ) => {
  console.log(body); //json object
});

app.get('/callback', (req, res) => {

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
