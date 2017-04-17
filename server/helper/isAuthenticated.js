module.exports = ({failJSON}) => {
	return (req, res, next) => {
		if(req.isAuthenticated()) next();
		else res.json(failJSON('not logged in'));
	}
}
