module.exports = (dependencies) => {
	let {bcrypt, saltRounds} = dependencies;
	return function hashIncomingPassword(req, res, next) {
		const {username, email, password} = req.body;
		console.log(username, email, password);
		function hashThis(thing) {
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(req.body[thing], salt, function(err, hash) {
					req.body[thing] = hash;
					next();
				});
			});
		}
		let {originalUrl: url, method, body: {newPassword}} = req;
		if(url === '/user/new' && method === 'POST') 
			hashThis('password');
		else if(url === '/user/update' && method === 'PUT' && newPassword) 
			hashThis('newPassword');
		else next();
	}
}
