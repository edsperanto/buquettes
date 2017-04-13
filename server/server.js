const https = require('https');
const request = require('request');
// express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// request handlers
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const qs = require('querystring');
const github = require('octonode');

//GITHUB Auth
const env = require('dotenv').config();
const { CLIENT_ID, CLIENT_SECRET, TOKEN } = process.env;
// const { CLIENT_SECRET } = process.env;

// console.log('client_ID', CLIENT_ID);

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
let targetURL_Repo = `https://github.com/login/oauth/authorize?scope=repo&client_id=${CLIENT_ID}`;
// let postURL = `https://github.com/login/oauth/access_token?${qs.stringify(body)}`;

app.use('/user', userRoute(express, bcrypt, saltRounds, passport, User));

app.get('/callback', ( req, res ) => {
          /* USING OCTONODE - SEEMS MORE SIMPLE SHOULD FIGURE OUT LATER client.get( ('/user/:username'){*/
          //   let scopes = {
          //   'add_scopes':['user', 'repo', 'gist'],
          //   'note': 'admin script'
          // };

          // github.auth.config({
          //   username: 'stevencable',
          //   password: 'steven'
          // }).login(scopes, function (err, id, token) {
          //   console.log('id and token: ', id, token);
          // });
          // });
  
  let body = {
    client_id: CLIENT_ID, 
    client_secret: CLIENT_SECRET, 
    code: req.query.code
  };

  request.post(
  { 
    url: `https://github.com/login/oauth/access_token?${qs.stringify(body)}`
    }, function(error, responseHeader, responseBody){
      console.log('responseBody: ', responseBody); //example: access_toke=40characters&scope=whateverWeSet&token_type=typically'bearer'
      let accessT = responseBody.substr(13,40) //save in database as access_token. may want to save scope as well!!
      console.log('accessT: ', accessT);
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

// function getRepo(clientURL) {
//   return new Promise((resolve, reject) => {
//     // console.log('i ran')
//     https.get(clientURL, res => {
//       let rawData = '';
//       res.on('data', (chunk) => {
//         rawData += chunk;
//         console.log('rawData: ', rawData)
//       });
//       res.on('end', () => {
//         resolve(rawData);
//       });
//     })
//     .on('error', err => reject(err));
//   });
// }

// start express server
if(!module.parent) {
	app.listen(PORT, _ => {
		console.log(`You and Port: ${PORT} are connected like soulmates`);
	});
}
