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

	//check if logged in
	router.use(isAuthenticated);
	let userIDtoUse = null;
	// Routes
	router.get('/authorize/', (req, res) => {
		let userIDtoUse = req.query.id;
		res.redirect(userRepoURL);

	});

	router.get('/callback', ( req , res ) => {     
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
				res.redirect('http://localhost'); //sends to home route
			});
		});
  });

  router.delete('/delete', (req, res) => {
    GitHubOAuth.destroy({
        where: {
            user_id:req.user.id
        }
    });
          res.send('You have officially removed authorization for StratosPeer to access your Github on your behalf. I hope you don\'t regret this.');
  });

  router.get('/search', ( req, res ) => {
  	
  	// const files = [];
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
	  	let searchURL = `https://api.github.com/user/repos?page=1&per_page=100&access_token=${accessT}`;

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
			let count = 0;

			return Promise.all(
				parsedBody.map((repo) => {						//grab each repo and store in array
					count++;
					console.log('count: ', count);
					let slicedURL = repo.commits_url.split('{')[0];
					let commitURLWithAccess = slicedURL.concat(access);
					let usersRepo = repo.owner.login;
					let repoName = repo.name;
					let default_branch = repo.default_branch;
					let pushed_at = repo.pushed_at;					

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
						let treeURL = `https://api.github.com/repos/${usersRepo}/${repoName}/git/trees/${newestSha}?recursive=1&access_token=${accessT}`;
						
						return Promise.all(
							[ 
								default_branch,
								pushed_at,
								rp.get(
									{
										url: treeURL,
										headers: {
											'User-Agent': 'Buquettes'
										}
									}
								)
							]
						);
					})
					.catch(err =>{
        		console.log('.then with shaArray: ', err);
      		});
				})
			)
			// then for Promise.all
			.then( (blob) => {
				let arrData = blob;

				let getProperties = (string) => {
					let stringArray = string.split('/');
					let arrayLength = stringArray.length-1;
					let name = stringArray[arrayLength];
					let owner = stringArray[4];
					let repo = stringArray[5];

					return { name, owner, repo };
				};

				let searchableArray = arrData.map( data => {

						let default_branch = data[0];
						let pushed_at = data[1];
						let parsed = JSON.parse(data[2]);
						let owner = getProperties(parsed.url).owner;
						let repo = getProperties(parsed.url).repo;
						let repo_html_url = `https://github.com/${owner}/${repo}${access}`;
					
					//URL to html of each repo
					parsed.html_url = repo_html_url;

					return parsed.tree.map(item => {

						let path = item.path;
						let type = item.type;
						let file_html_url = `https://github.com/${owner}/${repo}/${type}/${default_branch}/${path}${access}`;

						//add desired keys
						item.repo = getProperties(item.url).repo;
						item.name = getProperties(item.path).name;
						item.owner = getProperties(item.url).owner;
						item.default_branch = default_branch;
						item.pushed_at = pushed_at;
						item.html_url = file_html_url;

						return item;

					})
					.map((arr) => {
						//simplify object
						delete arr.mode;
						delete arr.sha;
						delete arr.size;
						delete arr.owner;
						delete arr.url;
						delete arr.default_branch;
						return arr;
					});
				})
				.reduce( (prev, curr) => {
					curr.shift();					
					curr.forEach( object => {
						prev.push(object);
					});
						return prev;
				}, []);
				console.log('sent to front end: ', searchableArray);
				res.send(searchableArray);   
			})
			.catch(err => {
				console.log('.then with blob: ', err);
			});
		})
		.catch(err =>{
        console.log('.then with body: ', err);
    });
	});


	return router;

};
