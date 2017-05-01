module.exports = ({failJSON}) => {
	return (req, res, next) => {
		if(req.isAuthenticated()) {
			next();
		}else{
			let {originalUrl: url, method} = req;
			url = url.split('?')[0];
	if(url === '/oauth2/box/authorize' && method === 'GET') 
				next();
			else if(url === '/oauth2/box/redirect' && method === 'GET')
				next();
			else
				res.json(failJSON('you think you can do that without being logged in? You got jokes!'));
		}
	};
};
