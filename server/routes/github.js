module.exports = (dependencies) => {

	// extract dependencies
	const {express, request, qs, GitHubOAuth} = dependencies;
	// const { isAuthenticated } = helper;
	const router = express.Router();

	// Environmental Variables
	const env = require('dotenv').config();
	const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;

	let userRepoURL = `https://github.com/login/oauth/authorize?scope=repo&client_id=${GH_CLIENT_ID}`;


	// Routes
	router.get('/authorize', ( req , res ) => {
		res.redirect(userRepoURL);
	});

	router.get('/callback', ( req , res ) => {     
		let body = {
			client_id: GH_CLIENT_ID, 
			client_secret: GH_CLIENT_SECRET, 
			code: req.query.code
		};

		let userPromise = new Promise( ( resolve , reject ) => {
			request.post({ 
				url: `https://github.com/login/oauth/access_token?${qs.stringify(body)}`
			}, 
			function( error , responseHeader , responseBody ){
				let accessT = responseBody.substr(13,40);
				resolve(accessT);    
			});
		});

		userPromise.then( ( token ) => {
			let userURL = `https://api.github.com/user?access_token=${token}`;
			return new Promise( ( resolve , reject ) => {
				request.get(
					{
						url: userURL,
						headers: {
							'User-Agent': 'Buquettes'
						}
					},
					function(err, header, body){
						let parsedBody = JSON.parse(body)
						let username = parsedBody.login;
						GitHubOAuth.create(
							{
								token: token,
								username: username,
								scope: 'repo'
							});

						resolve(parsedBody);
					})				
			})
			.then((userBody) => {
				console.log("userbody.repo ", userBody.repos_url);
				res.send(userBody);
			})
		});
  });

  // router.post('/search', (req, res) => {
  // 	let {query} = req.body;
  // 	let searchURL = `https://api.github.com/search/repositories?q=angular-instafeed%20+fork:true+user:edsperanto` ;
  // 	request.get(
		// 	{url: searchURL},
		// 	function(err, header, body){
		// 		body.map() 
		// 	}
		// );
  // });

  router.get('/search', ( req, res ) => {
  	// let repoName = 'angular-instafeed';
  	// let username = 'edsperanto';
  	// let searchURL = `https://api.github.com/search/repositories?q=${repoName}%20+fork:true+user:${username}` ;
  	// res.redirect(searchURL);
  	let {query} = req.body;
  	let searchURL = `https://api.github.com/search/users?q=edsperanto` ;
  	request.get(
			{
				url: searchURL,
				headers: {
					'User-Agent': 'Buquettes'
				}
			},
			function(err, header, body){
				let parsedBody = JSON.parse(body)

				console.log("parsedBody: ", parsedBody);
				// body.map((parsedBody) => {
						request.get(
							{
								url: parsedBody.repos_url,
								headers: {
									'User-Agent': 'Buquettes'
								}		
							},
							function(err, header, body){
								
							}
						)
					//}); 
			}
		);
		res.send('searchin bruh');
  })

	return router;

};
