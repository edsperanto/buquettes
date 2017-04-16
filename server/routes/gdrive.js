module.exports = (dependencies) => {

	// extract dependencies
	const {
		express, request, qs, helper, User,
		credentials: {gdrive: credentials}, GoogleDriveOAuth,
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
		scope: ['https://www.googleapis.com/auth/drive.readonly']
	});

	// gdrive routes
	router.get('/', isAuthenticated, (req, res) => {
		if(req.user) {
			GoogleDriveOAuth.findAll({
				username: req.user.username,
				include: {model: User, as: 'user'}
			}).then(list => res.send(list) );
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
			}).then(_ => res.json(successJSON));
		}
	});
	
	return router;

}
