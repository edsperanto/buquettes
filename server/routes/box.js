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
	const redirectURL = 'https://www.stratospeer.com/api/oauth2/box/redirect';
	var accessToken;

	// check logged in
	router.use(isAuthenticated);

	// TokenStore implementation
	router.use((req, res, next) => {
		class TokenStore {
			constructor(userID) {
				this.userID = userID;
			}
			read(callback) {
				BoxOAuth.findAll({
					where: {user_id: req.user ? req.user.id : userID}
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
					user_id: req.user ? req.user.id : userID,
					token: JSON.stringify(token)
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
	router.use((req, res, next) => {
		let tokenStore = new req.TokenStore();
		tokenStore.read((err, oldToken) => {
			if(err) {
				let url = req.originalUrl.split('?')[0];
				let notNew = url !== '/oauth2/box/authorize';
				let notRedir = url !== '/oauth2/box/redirect';
				if(notNew && notRedir) res.json(failJSON(err));
				else next();
			}else{
				let {refreshToken} = oldToken;
				sdk.getTokensRefreshGrant(refreshToken, (err, newToken) => {
					accessToken = newToken.accessToken;
					tokenStore.update(oldToken, newToken, _ => next());
				});
			}
		});
	});

	// GET newest access/refresh token
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

	// GET token for OAuth2
	let userID = null;
	router.get('/authorize', (req, res) => {
		userID = req.query.id;
		res.redirect('https://account.box.com/api/oauth2/authorize?response_type=code&client_id=' + clientID + '&redirect_uri=' + redirectURL + '&state=whatevs')
	});

	// GET redirect for OAuth2
	router.get('/redirect', (req, res) => {
		if(req.query.code) getToken(req.query.code);
		else if(req.query.error) res.json(failJSON('access denied by user'));
		else res.redirect('/404');
		function getToken(code) {
			sdk.getTokensAuthorizationCodeGrant(code, null, (err, tokenInfo) => {
				if(err) res.json(err);
				else storeToken(tokenInfo);
			});
		}
		function storeToken(token) {
			let tokenStore = new req.TokenStore(userID);
			if(token.error) res.json(failJSON(token.error_description));
			else tokenStore.write(token, ({token}) => {
				// res.json(Object.assign({}, successJSON, {token: JSON.parse(token)}));
				res.redirect('file:///');
			});
		}
	});
	
	router.use(isAuthenticated);

	// client helper
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

	// GET user info
	router.get('/user', (req, res) => {
		client.get('/users/me')
			.then(response => {
				let {name, login, avatar_url} = response;
				res.json(Object.assign({}, successJSON, {
					user: {name, login, avatar_url}
				}));
			});
	});

	// GET folder and file structure
	router.get('/search', (req, res) => {
		let root = {};
		const traverse = (id, par) => new Promise((resolve, _) => {
			client.get(`/folders/${id}`)
				.then(response => {
					let {name, type, item_collection, modified_at} = response;
					let {total_count, entries} = item_collection;
					let cutTZ = str => str.substring(0, str.length - 6);
					par[name] = {id, modified_at, children: {}};
					let children = par[name].children;
					let entriesArr = Promise.all(entries.map(entry => {
						if(entry.type === 'file') {
							return client.get(`/files/${entry.id}`)
								.then(response => ({
									[entry.name]: {
										id: response.id,
										modified_at: cutTZ(response.modified_at)
									}
								}));
						}else if(entry.type === 'folder') {
							return traverse(entry.id, children)
								.then(response => ({
									[entry.name]: {
										id: entry.id,
										modified_at: cutTZ(response.modified_at),
										children: response.children
									}
								}));
						}
					}));
					entriesArr
						.then(entriesRes => {
							par[name].children = entriesRes.reduce((prev, curr) => {
								return Object.assign(prev, curr);
							}, {});
							resolve(par[name]);
						});
				});
		});
		traverse('0', root).then(response => {
			res.json(Object.assign({}, successJSON, {
				"directory_structure": response
			}));
		});
	});

	// DELETE access tokens
	router.delete('/delete', (req, res) => {
		BoxOAuth.destroy({where: {user_id: req.user.id}})
			.then(_ => res.json(successJSON));
	});

	return router;

}
