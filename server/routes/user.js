
module.exports = function(dependencies) {

	// extract dependencies
	const {
		express, 
		bcrypt, 
		saltRounds, 
		passport, 
		User,
		successJSON,
		failJSON,
	} = dependencies;
	const router = express.Router();

	// load helper functions
	const {
		hashIncomingPassword,
		userRouteValidations,
	} = require('../helper')(dependencies);
	const {
		idFromUsernameOrEmail,
		checkExistingUsernameOrEmail,
		usernameFromEmail,
	} = userRouteValidations;

	router.get('/current', (req, res) => {
		let {username, email, first_name, last_name} = req.user;
		res.send(Object.assign(successJSON, {
			"currentUser": {
				username,
				email,
				first_name,
				last_name,
			}
		}));
		// res.send(req.user.dataValues.username);
	});

	router.post('/login', 
		usernameFromEmail, 
		passport.authenticate('local', {
			successRedirect: '/user/login/success',
			failureRedirect: '/user/login/fail',
		}
	));

	router.get('/login/success', (req, res) => {
		let {username, email, first_name, last_name} = req.user.dataValues;
		console.log('LOGIN SUCCESS!!!!!!!');
		res.json(Object.assign(successJSON, {
			"currentUser": {
				username,
				email,
				first_name,
				last_name,
			}
		}));
	});

	router.get('/login/fail', (req, res) => {
		res.json(failJSON('incorrect username or password'));
	});

	// hash all incoming passwords here to
	// avoid hashing before login route
	// because login route hashes password as well
	router.use(hashIncomingPassword);

	router.post('/new', (req, res) => {
		let {username, password, email, first_name, last_name} = req.body;
		checkExistingUsernameOrEmail(username, email, password)
			.then(_ => {
				return User.create({
					username,
					email,
					password,
					email,
					first_name,
					last_name,
					active: true,
				});
			})
			.then(user => {
				let {username, email, first_name, last_name} = user;
				let successMsg = Object.assign(successJSON, {
					"redirect": "/login",
					"newUser": {
						username,
						email,
						first_name,
						last_name,
					}
				});
				res.send(successMsg);
			})
			.catch(err => res.json(failJSON(err.message)));
	});

	router.put('/update', (req, res) => {
		let {
			username,
			email,
			password,
			newEmail,
			newPassword,
			first_name,
			last_name,
		} = req.body;
		idFromUsernameOrEmail(username, email, password)
			.then(user => {
				return User.update({
					email: newEmail || user.email,
					password: newPassword || user.password,
					first_name: first_name || user.first_name,
					last_name: last_name || user.last_name,
				}, {where: {id: user.id}});
			})
			.then(_ => res.json(successJSON))
			.catch(err => res.json(failJSON(err.message)));
	});

	router.delete('/', (req, res) => {
		let {username, email, password} = req.body;
		idFromUsernameOrEmail(username, email, password)
			.then(user => {
				return User.update({
					active: false,
				}, {where: {id: user.id}});
			})
			.then(_ => res.json(successJSON))
			.catch(err => res.json(failJSON(err.message)));
	});

	return router;

}
