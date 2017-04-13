module.exports = function(dependencies) {

	// extract dependencies
	const {
		User
	} = dependencies;

	function getIdThruUsername(username) {
		return new Promise((resolve, reject) => {
			User.find({where: {username}})
				.then(user => {
					if(user) resolve(user.id);
					else resolve(user);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	function getIdThruEmail(email) {
		return new Promise((resolve, reject) => {
			User.find({where: {email}})
				.then(user => {
					if(user) resolve(user.id);
					else resolve(user);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	function usernameOrEmail(username, email, password) {
		return new Promise((resolve, reject) => {
			let p1 = getIdThruUsername(username);
			let p2 = getIdThruEmail(email);
			Promise.all([p1, p2])
				.then(([id1, id2]) => {
					let id = id1 || id2;
					return User.findOne({where: {id, password}});
				})
				.then(user => {
					if(user) resolve(user);
					else reject('incorrect username/email or password');
				});
		});
	}

	return {
		usernameOrEmail
	}

}

