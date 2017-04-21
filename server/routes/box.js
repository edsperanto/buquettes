module.exports = dependencies => {

	// extract dependencies
	const {
		express, helper, User, request, rp,
		BoxOAuth, credentials: {box: credentials},
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
					.then(list => {
						if(list.length > 0) callback(null, list[0]);
						else callback('no oauth tokens stored for this user', null);
					});
			}
			write(token, callback) {
				if(!token.error) BoxOAuth.create({
					user_id: req.user.id,
					token: JSON.stringify(token),
				}).then(entry => callback(entry));
			}
			update(oldToken, newToken, callback) {
				BoxOAuth.update(
					{token: JSON.stringify(newToken)}, 
					{where: {token: JSON.stringify(oldToken)}}
				)
					.then(_ => callback());
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
	var accessToken;
	router.use((req, res, next) => {
		let tokenStore = new req.TokenStore();
		tokenStore.read((err, oldToken) => {
			if(err) {
				console.log(err);
				next();
			}else{
				let {refreshToken} = oldToken;
				sdk.getTokensRefreshGrant(refreshToken, (err, newToken) => {
					accessToken = newToken.accessToken;
					tokenStore.update(oldToken, newToken, _ => next());
				});
			}
		});
	});

	// see current one
	router.get('/', (req, res) => {
		if(req.user)
			BoxOAuth.findAll({
				username: req.user.username,
				include: {model: User, as: 'user'}
			})
				.then(list => list.map(entry => entry.token))
				.then(list => list.map(JSON.parse))
				.then(list => res.json(list));
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
			let tokenStore = new req.TokenStore();
			if(token.error) res.json(failJSON(token.error_description));
			else tokenStore.write(token, ({token}) => {
				res.json(Object.assign({}, successJSON, {token: JSON.parse(token)}));
			});
		}
	});

	// client
	const BoxUrl = url => {
		let base = `https://api.box.com/2.0${url}`;
		let join = (url.indexOf('?') > -1) ? '&' : '?';
		let token = `access_token=${accessToken}`;
		return base + join + token;
	}
	const client = {
		get: url => rp(BoxUrl(url)).then(JSON.parse),
		post: (url, payload) => {
			let options = {
				method: 'POST',
				uri: BoxUrl(url)
			}
			if(payload.body) {
				options.body = payload.body;
				options.json = true;
			}
			if(payload.form) {
				options.form = payload.form;
				options.headers = {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
			return rp(options).then(JSON.parse);
		}
	}

	// see user
	router.get('/user', (req, res) => {
		client.get('/users/me')
			.then(response => res.json(response));
	});

	// see folder
	router.get('/folders', (req, res) => {
		client.get('/folders/0')
			.then(response => res.json(response));
	});

	return router;

}
