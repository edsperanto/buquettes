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

	router.get('/', /*isAuthenticated,*/ (req, res) => {
		if(req.user) {
			GoogleDriveOAuth.findAll({
				username: req.user.username,
				include: {
					model: User,
					as: 'user'
				}
			})
				.then(gdriveOAuths => {
					console.log(gdriveOAuths);
					res.send('lel');
				});
		}
		res.json(req.user);
	});
	
	return router;

}
