module.exports = dependencies => {

  // extract dependencies
  const {
    express, request, rp, helper, 
    User, GitHubOAuth, GoogleDriveOAuth, BoxOAuth
  } = dependencies;

  const {successJSON, failJSON, isAuthenticated} = helper;
  const router = express.Router();

};