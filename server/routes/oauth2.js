module.exports = (dependencies) => {

	const {express} = dependencies;
	const router = express.Router();

	const githubRoute = require('./github');
	const gdriveRoute = require('./gdrive');

	router.use('/github', githubRoute(dependencies));
	router.use('/gdrive', gdriveRoute(dependencies));

	return router;

}
