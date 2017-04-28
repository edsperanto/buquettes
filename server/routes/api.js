module.exports = (dependencies) => {

	const {express} = dependencies;
	const router = express.Router();

	const userRoute = require('./user');
	router.use('/user', userRoute(dependencies));

	const oauthRoute = require('./oauth2');
	router.use('/oauth2', oauthRoute(dependencies));

	return router;

}
