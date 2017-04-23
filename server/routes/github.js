module.exports = (dependencies) => {

	// extract dependencies
	const {
		express, request, rp, qs, recursive, helper, GitHubOAuth, credentials: {github: credentials },
	} = dependencies;
	const { isAuthenticated } = helper;
	const router = express.Router();

	// Environmental Variables
	const env = require('dotenv').config();
	const { client_id, client_secret } = credentials;

	let userRepoURL = `https://github.com/login/oauth/authorize?scope=repo&client_id=${client_id}`;


	// Routes
	router.get('/authorize', isAuthenticated, (_, res) => res.redirect(userRepoURL));

	router.get('/callback', isAuthenticated, ( req , res ) => {     
		let body = { client_id , client_secret, code: req.query.code };

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
  		accessT = user.token;
  		access = `?access_token=${accessT}`;
	  	console.log('access token: ', accessT);
	  	let searchURL = `https://api.github.com/user/repos?page=1&per_page=14&access_token=${accessT}`;

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
			//console.log('body of search: ', parsedBody);
			let count = 0;

			return Promise.all(
				parsedBody.map((repo) => {						//grab each repo and store in array
				// console.log('repos?: ', repo);
					count++;
					console.log('count: ', count);
					let slicedURL = repo.commits_url.split('{')[0];
					let commitURLWithAccess = slicedURL.concat(access);
					let usersRepo = repo.owner.login;
					let repoName = repo.name;
					console.log('who\'s is this?: ', usersRepo);
					

					return rp.get(
						{
							url: commitURLWithAccess,
							headers: {
								'User-Agent': 'Buquettes'
							}		
						}
					)
					.then( (shaArray) => {
						//console.log('shaaaaaaaa: ', shaArray)
						let parsedCommits = JSON.parse(shaArray);
						let newestCommit = parsedCommits[0];
						let newestSha = newestCommit.sha;
						//console.log('who\'s is this?: ', usersRepo);
						let treeURL = `https://api.github.com/repos/${usersRepo}/${repoName}/git/trees/${newestSha}?recursive=1&access_token=${accessT}`;
						
						return rp.get(
							{
								url: treeURL,
								headers: {
									'User-Agent': 'Buquettes'
								}
							}
						);
					})
					.catch(err =>{
        		console.log('.then with shaArray: ', err);
      		});
				})
			)
			// then for Promise.all
			.then( (arrData) => {
				 //array object of strings
				console.log('worky: ', JSON.parse(arrData[0]).path);
				let name = (string) => {
					let stringArray = string.split('/');
					let arrayLength = stringArray.length-1;
					let name = string.split('/')[arrayLength];
					let owner = string.split('/')[4];

					return {name:name, owner:owner};
				}

				res.send(arrData.map( shit => {

						let parsed = JSON.parse(shit);

						parsed.tree.forEach(item => {
							console.log('owner: ', item.path)
							item.name = name(item.path).name;
							//item.owner = name(item.url).owner;--errors in buquettes
							// console.log('owner: ', item.owner)
						});
						console.log('is she parsed: ', parsed);
						// console.log('string? ', typeof parsed);
						return parsed;
					})
				);
			})
			.catch(err => {
				console.log('.then with arrData: ', err);
			})
		})
		.catch(err =>{
        console.log('.then with body: ', err);
      });
	});


	return router;

};
