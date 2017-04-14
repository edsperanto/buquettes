module.exports = function(dependencies) {

	// extract dependencies
	const {
		User, failJSON, bcrypt
	} = dependencies;

	function idFromUsernameOrEmail(username, email, password) {
		const errMsg = {"message": "incorrect username/email or password"};
		return new Promise((resolve, reject) => {
			let p1 = User.find({where: {username}});
			let p2 = User.find({where: {email}});
			Promise.all([p1, p2])
				.then(([r1, r2]) => ({
					id: (r1 || r2).id,
					res: bcrypt.compare(password, (r1 || r2).password)
				}))
				.then(({id, res}) => {
					if(res) resolve(id);
					else reject(errMsg);
				})
				.catch(_ => reject(errMsg));
		});
	}

	function checkExistingUsernameOrEmail(username, email, password) {
		return new Promise((resolve, reject) => {
			let p1 = User.find({where: {username}});
			let p2 = User.find({where: {email}});
			Promise.all([p1, p2])
				.then(([r1, r2]) => {
					if(!r1 && !r2) resolve('OK');
					else reject({"message": (r1)?"username taken":"email already used"});
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

