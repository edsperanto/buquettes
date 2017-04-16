module.exports = (dependencies) => {

	// extract dependencies
	const {express, request, qs, GitHubOAuth} = dependencies;
	const router = express.Router();

	// Environmental Variables
	const env = require('dotenv').config();
	const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;

	let userRepoURL = `https://github.com/login/oauth/authorize?scope=repo&client_id=${GH_CLIENT_ID}`;
	// let postURL = `https://github.com/login/oauth/access_token?${qs.stringify(body)}`;
	let facebook = 'https://facebook.com/';

	// Routes
	router.get('/authorize', (req,res) => {
		res.redirect(userRepoURL);
	});

	router.get('/callback', ( req, res ) => {     
		let body = {
			client_id: GH_CLIENT_ID, 
			client_secret: GH_CLIENT_SECRET, 
			code: req.query.code
		};

		let userPromise = new Promise(( resolve, reject ) => {
			request.post(
				{ 
				url: `https://github.com/login/oauth/access_token?${qs.stringify(body)}`
				}, 
				function(error, responseHeader, responseBody){
						console.log('WHATIS THIS', req.body);
						console.log('DOES THIS WORK', responseBody.body); //example: access_token=40characters&scope=whateverWeSet&token_type=typically'bearer'
						let accessT = responseBody.substr(13,40); //save in database as access_token. may want to save scope as well!!
						console.log('accessToken', accessT);
						console.log('promiseRan!');
						resolve(accessT);    
					})
			});

			userPromise.then((token) => {
				

			})

				// res.redirect(`https://api.github.com/user?access_token=${accessT}`);
				// let scope = responseBody.
				// Github.create(
				//   {
				//     token: accessT,

				//     user_id: 'insertuserhere',
				//     scope: 'fda'
				//   })
			// res.send('we done here'); //REDIRECT BACK TO APP LOGIN OR WHATEVER
		});
	// });

	return router;

}
