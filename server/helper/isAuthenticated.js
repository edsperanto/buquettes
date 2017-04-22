module.exports = ({failJSON}) => {
	return (req, res, next) => {
		if(req.isAuthenticated()) next();
		else res.json(failJSON('you think you can do that without being logged in? You got jokes!'));
	};
};
