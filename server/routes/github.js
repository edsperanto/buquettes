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

  router.get('/search', isAuthenticated, ( req, res ) => {
  	const files = [];
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
 
  	GitHubOAuth.findOne(
  		{
  			where: {
  				user_id: req.user.id
  			}
  		})
  	.then((user) => {
  		let githubUsername = user.username;
	  	let searchURL = `https://api.github.com/search/users?q=${githubUsername}` ;

	  	rp.get(
				{
					url: searchURL,
					headers: {
						'User-Agent': 'Buquettes'
					}
				})
				.then((body) => {
					let parsedBody = JSON.parse(body);
					let repoURL = parsedBody.items[0].repos_url;
					// console.log('repoURL: ', repoURL)
					
					GitHubOAuth.findOne(
					{
						where: {
							user_id: req.user.id
						}
					})
					.then((chunk) => {
						let accessToken = chunk.token;
						let access = `?access_token=${chunk.token}`;
						let repoWithAccess = repoURL.concat(access);
						
						rp.get(
							{
								url:	repoWithAccess,
									headers: {
										'User-Agent': 'Buquettes'
									}				
						 	})
							.then( (body) => {
								
								let parsedRepos = JSON.parse(body);
								let count = 0;
								parsedRepos.map((repo) => {						//grab each repo and store in array
								
								let isNotRepo = repo.path;			//this means it is a file or a directory
									if(isNotRepo){
										res.send('Unfortunately we couldn\'t find your Repo/Directory/File');
									}
									if(!isNotRepo){
										count++;
										//console.log("This must be a repo", repo.name);
										let slicedURL = repo.commits_url.split('{')[0];
										// console.log('slicedURL: ', slicedURL)
										//let repoURL = repo.html_url;
										//console.log('sliced:: ', slicedURL);
										let commitURLWithAccess = slicedURL.concat(access);
										// console.log('commit url with access: ', commitURLWithAccess);
										// console.log('are these my repos?: ', repoURLWithAccess);
										// shallowClone(repoURL, '~/DevLeague/final-project/shallowRepos/', (stuff) => {
										// 	console.log('SHALLOW CLONE ME! ', repoURL);
										// });
										//https://api.github.com/repos/StevenCable/100-Specs/git/trees/af5756379414b42b4f5a1cd0af0483b1346af9fc?recursive=1?access_token=f7f8c104bc937d916466b5fba76af0688a2576e8
										rp.get(
											{
												url: commitURLWithAccess,
												headers: {
													'User-Agent': 'Buquettes'
												}		
											})
											.then( (shaArray) => {
												let parsedCommits = JSON.parse(shaArray);
												let newestCommit = parsedCommits[0];
												// console.log('is this an object with sha?: ', newestCommit)
												let newestSha = newestCommit.sha;
												// console.log('is this my sha?: ', newestSha);
												console.log('access? : ', repo.name)
												let treeURL = `https://api.github.com/repos/${githubUsername}/${repo.name}/git/trees/${newestSha}?recursive=1&access_token=${accessToken}`;

												rp.get(
													{
														url: treeURL,
														headers: {
															'User-Agent': 'Buquettes'
														}
													})
													.then((data)=> {
														// console.log(data)
														let parse = JSON.parse(data);
														console.log(parse);
														files.push(parse)
														

													})
													.then( (array) => {
														console.log("array: ", files);
														// res.send(files)
													});
											})
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
									}
								});
								console.log(count);								
							});
						}
					);
				} 
			);
		// res.send(files);
		});
  });

	return router;

};
