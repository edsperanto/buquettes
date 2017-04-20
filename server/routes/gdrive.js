module.exports = (dependencies) => {

	// extract dependencies
	const {
		express, helper, User, GoogleDriveOAuth,
		credentials: {gdrive: credentials}, 
	} = dependencies;
	const {successJSON, failJSON, isAuthenticated} = helper;
	const router = express.Router();

	// Google Drive specific dependencies
	const google = require('googleapis');
	const googleAuth = require('google-auth-library');

	// generate oauthUrl
	const {
		client_secret: clientSecret,
		client_id: clientId,
		redirect_uris: [redirectUrl],
	} = credentials.web;
	const auth = new googleAuth();
	const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
	const oauthUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: ['https://www.googleapis.com/auth/drive',
					'https://www.googleapis.com/auth/activity',
					'https://www.googleapis.com/auth/drive.metadata']
	});

	// gdrive API
	const drive = google.drive({
		version: 'v3',
		auth: oauth2Client
	});

	// set credentials automatically
	router.use((req, res, next) => {
		if(req.user) {
			GoogleDriveOAuth.findAll({
				username: req.user.username,
				include: {model: User, as: 'user'}
			})
				.then(list => list.map(entry => entry.credentials))
				.then(list => list.map(entry => JSON.parse(entry)))
				.then(list => list.filter(entry => entry.refresh_token))
				.then(list => oauth2Client.setCredentials(list[0]))
				.then(_ => next());
		}
	});

	// gdrive routes
	router.get('/', isAuthenticated, (req, res) => {
		if(req.user) {
			GoogleDriveOAuth.findAll({
				username: req.user.username,
				include: {model: User, as: 'user'}
			})
				.then(list => list.map(entry => entry.credentials))
				.then(list => list.map(entry => JSON.parse(entry)))
				.then(list => res.json(list));
		}
	});

	router.get('/files', isAuthenticated, (req, res) => {
		drive.files.list({
				// q: "fullText contains 'adkfsaklfj'",
			}, 
			(err, result) => {
				if(err || !result) res.json(failJSON(err));
				else showMore(result.files);
			}
		);
		function showMore(list) {
			res.json(list);
			list.forEach(file => {
				console.log(file.id);
					drive.files.get({
						fileId: file.id
					}, 
					(err, result) => {
						console.log(file.name);
						console.log(result);
					}
				);
			});
		}
	});

	router.get('/new', isAuthenticated, (_, res) => res.redirect(oauthUrl));

	router.get('/redirect', (req, res) => {
		if(req.query.error) res.json(failJSON('access denied by user'));
		else if(req.query.code) getToken(req.query.code);
		else res.redirect('/404');
		function getToken(code) {
			oauth2Client.getToken(req.query.code, (err, token) => {
				if(err) return res.json(failJSON('error retrieving access token'));
				storeToken(oauth2Client.credentials = token);
				oauth2Client.setCredentials(token);
			});
		}
		function storeToken(token) {
			GoogleDriveOAuth.create({
				user_id: req.user.id,
				credentials: JSON.stringify(token),
				token: req.query.code,
			})
				.then(token => res.json(Object.assign({}, successJSON, {
					credentials: JSON.parse(token.credentials)
				})));
		}
	});
	
	return router;

}
