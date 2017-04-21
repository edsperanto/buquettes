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

	// tokenStore implementation
	router.use((req, res, next) => {
		class TokenStore {
			constructor(userID) {
				this.userID = userID;
			}
			read(callback) {
				BoxOAuth.findAll({
					username: req.user.username,
					include: {model: User, as: 'user'}
				})
					.then(list => list.map(entry => entry.token))
					.then(list => list.map(entry => JSON.parse(entry)))
					.then(list => list.filter(entry => entry.refreshToken))
					.then(list => callback(null, list[0]));
			}
			write(token, callback) {
				if(!token.error) BoxOAuth.create({
					user_id: req.user.id,
					token: JSON.stringify(token),
				}).then(_ => callback());
			}
			clear(callback) {
				BoxOAuth.destroy({where: {id: req.user.id}})
					.then(_ => callback());
			}
		}
		req.TokenStore = TokenStore;
		next();
	});

	// set credentials automatically
	router.use((req, res, next) => {
		if(!req.BoxClient) {
			let tokenStore = new req.TokenStore();
			tokenStore.read((err, token) => {
				req.BoxClient = sdk.getPersistentClient(token, tokenStore);
				console.log('HERE', token);
				next();
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
			sdk.getTokensAuthorizationCodeGrant(code, null, (err, tokenInfo) => {
				if(err) res.json(err);
				else storeToken(tokenInfo);
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
