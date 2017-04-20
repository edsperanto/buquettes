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

	// check logged in
	router.use(isAuthenticated);

	// set credentials automatically
	router.use((req, res, next) => {
		if(req.user) {
			BoxOAuth.findAll({
				username: req.user.username,
				include: {model: User, as: 'user'}
			})
				.then(list => list.map(entry => entry.token))
				.then(list => list.map(entry => JSON.parse(entry)))
				.then(list => list.filter(entry => entry.refresh_token))
				.then(list => {
					if(list.length > 0) {
						let entry = list[0];
						let options = {
							url: 'https://api.box.com/oauth2/token',
							method: 'POST',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							form: {
								'grant_type': 'refresh_token',
								'refresh_token': entry.refresh_token,
								'client_id': clientID,
								'client_secret': clientSecret
							}
						}
						request(options, (err, header, body) => {
							let newToken = JSON.parse(body);
							BoxOAuth.update(
								{token: body},
								{where: {token: JSON.stringify(entry)}}
							).then(_ => {
								next();
							});
						});
					}else{
						next();
					}
				});
		}else{
			next();
		}
	});

	// see current one
	router.get('/', (req, res) => {
		if(req.user) {
			BoxOAuth.findAll({
				username: req.user.username,
				include: {model: User, as: 'user'}
			})
				.then(list => list.map(entry => entry.token))
				.then(list => list.map(JSON.parse))
				.then(list => res.json(list));
		}
	});

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
