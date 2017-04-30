module.exports = (dependencies) => {

	// extract dependencies
	const {
		express, bcrypt, saltRounds, passport, 
		User, helper
	} = dependencies;
	const router = express.Router();

	// load helper functions
	const {
		hashIncomingPassword, userRouteValidations,
		successJSON, failJSON
	} = helper;
	const {
		idFromUsernameOrEmail,
		checkExistingUsernameOrEmail,
		usernameFromEmail,
		lowercaseEmailAndUsername,
	} = userRouteValidations;

	router.use(lowercaseEmailAndUsername);
	router.use(hashIncomingPassword);

	router.get('/current', (req, res) => {
		if(req.user) {
			let {username, email, first_name, last_name} = req.user;
			res.json(Object.assign({}, successJSON, {
				"currentUser": {username, email, first_name, last_name}
			}));
		}else{
			res.send(failJSON('no user currently logged in'));
		}
	});

	router.get('/logout', (req, res) => {
		req.logout();
		res.json(successJSON);
	});

	router.post('/login', 
		usernameFromEmail, 
		passport.authenticate('local', {
			successRedirect: '/api/user/login/success',
			failureRedirect: '/api/user/login/fail',
		}
	));

	router.get('/login/success', (req, res) => {
		let {id, username, email, first_name, last_name} = req.user.dataValues;
		res.json(Object.assign({}, successJSON, {
			"currentUser": {id, username, email, first_name, last_name}
		}));
	});

	router.get('/login/fail', (req, res) => {
		res.json(failJSON('incorrect username or password'));
	});

	router.post('/new', (req, res) => {
		let {username, password, email, first_name, last_name} = req.body;
		checkExistingUsernameOrEmail(username, email, password)
			.then(_ => {
				return User.create({
					username, email, password, email,
					first_name, last_name, active: true,
				});
			})
			.then(user => {
				let {username, email, first_name, last_name} = user;
				res.send(Object.assign({}, successJSON, {
					"redirect": "/login",
					"newUser": {username, email, first_name, last_name}
				}));
			})
			.catch(err => res.json(failJSON(err.message)));
	});

	router.put('/update', (req, res) => {
		let {
			username, email, password, newEmail,
			newPassword, first_name, last_name,
		} = req.body;
		idFromUsernameOrEmail(username, email, password)
			.then(id => User.findOne({where: {id}}))
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
			.then(id => {
				return User.update({
					active: false,
				}, {where: {id}});
			})
			.then(_ => res.json(successJSON))
			.catch(err => res.json(failJSON(err.message)));
	});

	return router;

}
