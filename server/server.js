// express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// request handlers
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
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

// routes

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
		console.log(`Server listening at port ${PORT}`);
	});
}
