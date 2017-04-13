module.exports = (dependencies) => {
	let {bcrypt, saltRounds} = dependencies;
	return function hashIncomingPassword(req, res, next) {
		if(req.body) {
			if(req.body.password) {
				bcrypt.genSalt(saltRounds, function(err, salt) {
					bcrypt.hash(req.body.password, salt, function(err, hash) {
						req.body.password = hash;
						next();
					});
				});
			}else next();
		}else next();
	}
}
