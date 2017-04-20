module.exports = dependencies => {

	// extract dependencies
	const {
		express, helper, User, request, BoxOAuth,
		credentials: {box: credentials},
	} = dependencies;
	const {successJSON, failJSON, isAuthenticated} = helper;
	const router = express.Router();

	// Box specific dependencies
	const BoxSDK = require('box-node-sdk');
	const {clientID, clientSecret} = credentials;
	const sdk = new BoxSDK({clientID, clientSecret});

	// set credentials automatically
	router.use((req, res, next) => {
		if(req.user) {
			BoxOAuth.findAll({
				username: req.user.username,
				include: {model: User, as: 'user'}
			})
				.then(list => {
					if(list.length > 0) res.json(list);
					else next();
				});
		}
	})

	// get token
	router.get('/new', (req, res) => res.redirect('https://account.box.com/api/oauth2/authorize?response_type=code&client_id=' + clientID + '&redirect_uri=http://localhost:9000/oauth2/box/redirect&state=whatevs'));
	
	// redirect
	router.get('/redirect', (req, res) => {
		if(req.query.code) getToken(req.query.code);
		else res.redirect('/404');
		function getToken(code) {
			request.post({
				url: 'https://api.box.com/oauth2/token',
				form: {
					grant_type: 'authorization_code',
					code: req.query.code,
					client_id: clientID,
					client_secret: clientSecret
				}
			}, (err, header, body) => {
				storeToken(JSON.parse(body));
			});
		}
		function storeToken(token) {
			if(token.error) res.json(failJSON(token.error_description));
			else BoxOAuth.create({
				user_id: req.user.id,
				token: JSON.stringify(token),
			})
				.then(({token}) => res.json(Object.assign({}, successJSON, {
					token: JSON.parse(token)
				})));
		}
	});

	return router;

}
