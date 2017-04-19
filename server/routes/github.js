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
						let parsedBody = JSON.parse(body);
						let username = parsedBody.login;
						GitHubOAuth.create(
							{
								token: token,
								username: username,
								scope: 'repo',
								user_id: req.user.id
							});

						resolve(parsedBody);
					});				
			})
			.then((userBody) => {
				console.log("userbody.repo ", userBody.repos_url);
				res.send(userBody);
			});
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
  	let searchURL = `https://api.github.com/search/users?q=stevencable` ;
  	request.get(
			{
				url: searchURL,
				headers: {
					'User-Agent': 'Buquettes'
				}
			},
			function(err, header, body){
				let parsedBody = JSON.parse(body);
				let repoURL = parsedBody.items[0].repos_url;
				console.log('req user: ', req.user.id)
				GitHubOAuth.findOne(
				{
					where: {
						user_id: req.user.id
					}
				})
				.then((chunk) => {
					let access = `?access_token=${chunk.token}`;
					console.log('is this my database?: ', access)
					let repoWithAccess = repoURL.concat(access);
					console.log('repoURL: ', repoWithAccess)
					
					request.get(
						{
							url:	repoWithAccess,
								headers: {
									'User-Agent': 'Buquettes'
								}				
					 	},
							function(err, header, body){
								// console.log('what is this body: ', body)
								let parsedRepos = JSON.parse(body);
								let count = 0;
								parsedRepos.map((repo) => {
								//console.log('parsedRepos.publicShit: ', repo.fork);
								let isNotRepo = repo.path;
									if(isNotRepo){
										// console.log('this is a directory or file', repo.name);
									}
									if(!isNotRepo){
										count++
										//console.log("This must be a repo", repo.name);
										let slicedURL = repo.contents_url.split('{')[0]
										//console.log('sliced:: ', slicedURL);
										let slicedURLWithAccess = slicedURL.concat(access);
										request.get(
											{
												url: slicedURLWithAccess,
												headers: {
													'User-Agent': 'Buquettes'
												}		
											},
											function(err, header, body){
												//console.log('inner body?: ', body);
												let repo = JSON.parse(body);
												//console.log('repoooo: ', repo);

												repo.map((repo) => {
													if(repo.type == 'dir' ){
														let dir = repo;

														console.log('this is a directory: ', dir.name)
														console.log('store this html link: ', dir.html_url)

													}

													if(repo.type === 'file' ){
														let file = repo;
														console.log('this is a file ', file.name)
														console.log('store this html link: ', file.html_url)

													}
													
												})
											}
										);
									}
								})
								console.log(count)
								// parsedRepos.map((repo) => {
								// });
								
							})
						}
				);
			} 
		);
		res.send('searchin bruh');
  })

	return router;

};
