module.exports = (dependencies) => {

	const {express} = dependencies;
	const router = express.Router();

	router.use('/github', require('./github')(dependencies));
	router.use('/gdrive', require('./gdrive')(dependencies));

	return router;

}
