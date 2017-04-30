module.exports = (dependencies) => {

	const {express} = dependencies;
	const router = express.Router();

	router.use('/github', require('./github')(dependencies));
	router.use('/gdrive', require('./gdrive')(dependencies));
  router.use('/box', require('./box')(dependencies));
	router.use('/all', require('./allServices')(dependencies));

	return router;

}
