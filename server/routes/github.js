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

  router.delete('/delete', (req, res) => {
  	console.log('this is the delete route: ');
  	GitHubOAuth.findAll({
  		where: {
  			user_id: req.user.id
  		}
  	})
  	.then((user) => {
  		console.log('user info: ', user);
  		GitHubOAuth.destroy({
  			where: {
  				user_id:req.user.id
  			}
  		});
  		res.send('You have officially removed authorization for StratosPeer to access your Github on your behalf. I hope you don\'t regret this.');
  	});
  });

  router.get('/search', isAuthenticated, ( req, res ) => {
  	
  	const files = [];
  	const user = {
  		repos: ''
  	};
  	var accessT;
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

			return GitHubOAuth.findOne(
				{
					where: {
						user_id: req.user.id
					}
				}
			);
		})
		.then((chunk) => {
			accessT = chunk.token;
			access = `?access_token=${accessT}`;
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
						let treeURL = `https://api.github.com/repos/${githubUsername}/${repo.name}/git/trees/${newestSha}?recursive=1&access_token=${accessT}`;
						
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
				res.send(arrData.map(JSON.parse));
			});
		});
	});


	return router;

};
