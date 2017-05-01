module.exports = dependencies => {

  // extract dependencies
  const {
    express, request, rp, helper, passport,
    User, GitHubOAuth, GoogleDriveOAuth, BoxOAuth
  } = dependencies;

  const {successJSON, failJSON, isAuthenticated} = helper;
  const router = express.Router();

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
          .then(list => list.length > 0), 
          GitHubOAuth.findAll({
            where: {
              user_id: req.user.id
            }
          })
          .then(list => list.length > 0)
        ]
      )
      .then(services => {
        let serviceObj = {};
        serviceObj.box = services[0];
        serviceObj.github = services[1];
        res.send(serviceObj);
      })
      .catch(err => {
        console.log('serviceObj is not working ', err);
      });
    }

  });
  return router;
};
