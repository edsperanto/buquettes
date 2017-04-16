module.exports = function(dependencies) {
	return {
		hashIncomingPassword: require('./hashIncomingPassword')(dependencies),
		userRouteValidations: require('./userRouteValidations')(dependencies),
	}
}
