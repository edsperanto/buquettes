module.exports = function(dependencies) {
	return {
		hashIncomingPassword: require('./hashIncomingPassword')(dependencies),
		userRouteValidations: require('./userRouteValidations')(dependencies),
		isAuthenticated: require('./isAuthenticated')(dependencies),
		successJSON: dependencies.successJSON,
		failJSON: dependencies.failJSON,
	}
}
