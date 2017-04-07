module.exports = function(express, bcrypt, passport, User) {

	const router = express.Router();

	router.post('/login', passport.authenticate('local', {
		successRedirect: '/success',
		failureRedirect: '/login'
	}));

	router.post('/new', (req, res) => {
		console.log(req.body);
		bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(req.body.password, salt, function(err, hash) {
				User.create({
					username: req.body.username,
					password: hash
				}).then(_ => {
					res.redirect('/login');
				});
			});
		});
	});

	return router;

}
