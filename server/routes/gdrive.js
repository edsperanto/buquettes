module.exports = (dependencies) => {

	// extract dependencies
	const {express, successJSON, failJSON} = dependencies;
	const router = express.Router();
	
	return router;

}
