module.exports = function(dependencies) {

	// extract dependencies
	const {
		User
	} = dependencies;

	function usernameOrEmail(username, email) {
		User.findOne({where: {username}});
	}

	return {
		usernameOrEmail
	}

}
