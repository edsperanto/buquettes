module.exports = dependencies => {

  // extract dependencies
  const {
    express, request, rp, helper, passport, credentials,
    User, GitHubOAuth, GoogleDriveOAuth, BoxOAuth
  } = dependencies;

  const {successJSON, failJSON, isAuthenticated} = helper;
  const router = express.Router();
	const app = express();

  //check if signed in
  router.use(isAuthenticated);

  router.get('/', ( req, res ) => {
    if(req.user){
      Promise.all( 
        [
          BoxOAuth.findAll({
            where: {
              user_id: req.user.id
            }
          })
					.then(list => {
						const BoxSDK = require('box-node-sdk');
						const {clientID, clientSecret} = credentials.box;
						const sdk = new BoxSDK({clientID, clientSecret});
						if(list.length > 0) {
							const oldToken = list[0].dataValues.token;
							const {refreshToken} = JSON.parse(oldToken);
							return new Promise((resolve, reject) => {
								sdk.getTokensRefreshGrant(refreshToken, (err, newToken) => {
									if(err) {
										BoxOAuth.destroy({where: {user_id: req.user.id}})
											.then(_ => resolve(false));
									}else{
										BoxOAuth.update(
											{token: JSON.stringify(newToken)},
											{where: {token: oldToken}}
										)
											.then(_ => resolve(true));
									}
								});
							});
						}else{
							return false;
						}
					}),
          GitHubOAuth.findAll({
            where: {
              user_id: req.user.id
            }
          })
          .then(list => {
						if(list.length > 0) {
							const {client_id, client_secret} = credentials.github;
							const token = list[0].dataValues.token;
							const options = {
								uri: `https://${client_id}:${client_secret}@api.github.com/applications/${client_id}/tokens/${token}`,
								headers: {'User-Agent': 'Request-Promise'}
							}
							return rp(options)
								.then(response => true)
								.catch(err => false);
						}else{
							return false;
						}
					})
        ]
      )
      .then(services => {
        let serviceObj = {};
        serviceObj.box = services[0];
        serviceObj.github = services[1];
        res.send(serviceObj);
      })
      .catch(err => {
        // console.log('serviceObj is not working ', err);
      });
    }

  });
  return router;
};
