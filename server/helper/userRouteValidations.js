module.exports = function(dependencies) {

	// extract dependencies
	const {
		User, failJSON, bcrypt
	} = dependencies;

	function getIdThruUsername(username) {
		return new Promise((resolve, reject) => {
			User.find({where: {username}})
				.then(user => {
					if(user) resolve(user);
					else resolve(user);
				});
		});
	}

	function getIdThruEmail(email) {
		return new Promise((resolve, reject) => {
			User.find({where: {email}})
				.then(user => {
					if(user) resolve(user);
					else resolve(user);
				});
		});
	}

	function idFromUsernameOrEmail(username, email, password) {
		return new Promise((resolve, reject) => {
			let p1 = getIdThruUsername(username);
			let p2 = getIdThruEmail(email);
			let userId;
			Promise.race([p1, p2])
				// .then(id => User.findOne({where: {id, password}}))
				.then(user => {
					userId = user.id;
					return bcrypt.compare(password, user.password)
				})
				.then(res => {
					if(res) resolve(userId);
					else reject({"message": "incorrect username/email or password"});
				});
		});
	}

	function checkExistingUsernameOrEmail(username, email, password) {
		return new Promise((resolve, reject) => {
			let p1 = getIdThruUsername(username);
			let p2 = getIdThruEmail(email);
			Promise.all([p1, p2])
				.then(([id1, id2]) => {
					if(id1) reject({"message": "username taken"});
					else if(id2) reject({"message": "email already used"});
					else resolve('OK');
				});
		});
	}

	function usernameFromEmail(req, res, next) {
		let {username, email} = req.body;
		if(email) {
			User.find({where: {email}}).then(user => {
				if(user) req.body.username = user.username;
				next();
			});
		}else{
			next();
		}
	}

	return {
		idFromUsernameOrEmail,
		checkExistingUsernameOrEmail,
		usernameFromEmail,
	}

}

