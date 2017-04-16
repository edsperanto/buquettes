module.exports = (dependencies) => {

	// extract dependencies
	const {express, request, qs, successJSON, failJSON} = dependencies;
	const router = express.Router();
	
	return router;

}
