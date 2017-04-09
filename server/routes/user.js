const {hashIncomingPassword} = require('../helper');

module.exports = function(express, bcrypt, saltRounds, passport, User) {

	const router = express.Router();
	const successJSON = {"success": true};
	const failJSON = {"success": false};

	router.get('/current', (req, res) => {
		res.send(req.user.dataValues.username);
	});

	router.post('/login', passport.authenticate('local', {
		successRedirect: '/user/login/success',
		failureRedirect: '/user/login/fail'
	}));

	router.get('/login/success', (req, res) => {
		res.json({"success": true});
	});

	router.get('/login/fail', (req, res) => {
		res.json({"success": false});
	});

	router.use(hashIncomingPassword);

	router.post('/new', (req, res) => {
		User.create({
			username: req.body.username,
			password: req.body.password
		}).then(_ => {
			res.redirect('/login');
		});
	});

	router.put('/update', (req, res) => {
		User.findOne({where: {id: req.body.id}})
			.then(user => {
				if(!user) throw new Error();
				let {id, password, token} = req.body;
				return User.update({
						username: user.username, 
						password: password || user.password, 
						token: token || user.token
				}, {where: {id}});
			})
			.then(_ => res.json(successJSON))
			.catch(_ => res.json(failJSON));
	});

	router.delete('/', (req, res) => {
		User.destroy({where: {
			id: req.body.id,
			username: req.body.username
		}})
			.then(_ => res.json(successJSON))
			.catch(_ => res.json(failJSON));
	});

	return router;

}
