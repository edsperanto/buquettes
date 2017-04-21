module.exports = (dependencies) => {

	// extract dependencies
	const {express, request, rp, qs, shallowClone, recursive, helper, GitHubOAuth} = dependencies;
	const { isAuthenticated } = helper;
	const router = express.Router();

	// Environmental Variables
	const env = require('dotenv').config();
	const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;

	let userRepoURL = `https://github.com/login/oauth/authorize?scope=repo&client_id=${GH_CLIENT_ID}`;


	// Routes
	router.get('/authorize', isAuthenticated, (_, res) => res.redirect(userRepoURL));

	router.get('/callback', isAuthenticated, ( req , res ) => {     
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
  	// let githubUsername = user.username;
	 	// let searchURL = `https://api.github.com/search/users?q=${githubUsername}` ;

  	// Promise.all(
  	// 	rp.get(searchURL)
  	// )
  	// .then( (repos) => {
  	// 	user.repos = JSON.parse(repos);
  	// 	console.log('user repos: ', user.repos);

  	// 	return Promise.all(
  	// 		user.repos.repos_url.map( (reposURL) => {
  	// 			console.log('repos URL: ', reposURL);
  	// 			rp.get(reposURL);
  	// 		})
  	// 		.then( url => {
  	// 			user.repos.repos_url = url;
  	// 			console.log('user: ', user)
  	// 			res.send('i hope this works');
  	// 		})
  	// 	);
  	// });

  router.get('/search', isAuthenticated, ( req, res ) => {
  	
  	const files = [];
  	const user = {
  		repos: ''
  	};
  	var accessToken;
  	var access;
  	var repoURL;
  	var githubUsername;
 
  	GitHubOAuth.findOne(
  		{
  			where: {
  				user_id: req.user.id
  			}
  		}
  	)
  	.then((user) => {
  		githubUsername = user.username;
	  	let searchURL = `https://api.github.com/search/users?q=${githubUsername}` ;

	  	return rp.get(
				{
					url: searchURL,
					headers: {
						'User-Agent': 'Buquettes'
					}
				}
			);
		})
		.then((body) => {
			let parsedBody = JSON.parse(body);
			repoURL = parsedBody.items[0].repos_url;
			console.log('repoURL: ', repoURL)
			

			return GitHubOAuth.findOne(
				{
					where: {
						user_id: req.user.id
					}
				}
			);
		})
		.then((chunk) => {
			accessToken = chunk.token;
			access = `?access_token=${accessToken}`;
			let repoWithAccess = repoURL.concat(access);
		
			return rp.get(
				{
					url:	repoWithAccess,
						headers: {
							'User-Agent': 'Buquettes'
						}				
			 	}
			);
		})
		.then((body) => {									
			let parsedRepos = JSON.parse(body);
			let count = 0;

			return Promise.all(
				parsedRepos.map((repo) => {						//grab each repo and store in array
					count++;
					let slicedURL = repo.commits_url.split('{')[0];
					let commitURLWithAccess = slicedURL.concat(access);
					console.log('commiturl: ', commitURLWithAccess);

					return rp.get(
						{
							url: commitURLWithAccess,
							headers: {
								'User-Agent': 'Buquettes'
							}		
						}
					)
					.then( (shaArray) => {
						let parsedCommits = JSON.parse(shaArray);
						let newestCommit = parsedCommits[0];
						let newestSha = newestCommit.sha;
						let treeURL = `https://api.github.com/repos/${githubUsername}/${repo.name}/git/trees/${newestSha}?recursive=1&access_token=${accessToken}`;
						
						return rp.get(
							{
								url: treeURL,
								headers: {
									'User-Agent': 'Buquettes'
								}
							}
						);
					});
				})
			)
			// then for Promise.all
			.then( (arrData) => {
				// console.log('stuff: ', arrData );
				console.log('what is you: ', typeof arrData);
				res.send(arrData.map(JSON.parse))
				// let treeArray = JSON.parse(arrData);
			});
		});
	});



							// 							.then( (array) => {
							// 								console.log("array: ", files);
							// 								res.send(files)
							// 							});
							// 					})
												// .then( ())
											// 	function(err, header, body){
											// 		//console.log('inner body?: ', body);
											// 		let repo = JSON.parse(body);
											// 		//console.log('repoooo: ', repo);

											// 		repo.map((repo) => {
											// 			if(repo.type == 'dir' ){
											// 				let dir = repo;
											// 				// console.log('this is a directory: ', dir.name);
											// 				// console.log('store this html link: ', dir.html_url);
											// 				//recursive check if file function goes here

											// 			}
											// 			if(repo.type === 'file' ){
											// 				let file = repo;
											// 				// console.log('this is a file ', file.name);
											// 				// console.log('store this html link: ', file.html_url);

											// 			}
														
											// 		});
											// 	}
											// );
				// 						}
				// 					})
				// 				);
				// 				console.log(count);								
				// 			});
		// 					}
		// 			)}
		// 			
		// 		});
		// // res.send(files);
		// });
  // });

	return router;

};
