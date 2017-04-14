// express
const express = require('express');
const router = express.Router();

// libraries
const request = require('request');
const qs = require('querystring');

// Environmental Variables
const env = require('dotenv').config();
const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;

let userRepoURL = `https://github.com/login/oauth/authorize?scope=repo&client_id=${GH_CLIENT_ID}`;
// let postURL = `https://github.com/login/oauth/access_token?${qs.stringify(body)}`;

// Routes
router.get('/authorize', (req,res) => {
  res.redirect(userRepoURL);
});

router.get('/callback', ( req, res ) => {     
  let body = {
    client_id: GH_CLIENT_ID, 
    client_secret: GH_CLIENT_SECRET, 
    code: req.query.code
  };

  request.post(
    { 
    url: `https://github.com/login/oauth/access_token?${qs.stringify(body)}`
    }, function(error, responseHeader, responseBody){
      console.log('responseBody: ', responseBody); //example: access_token=40characters&scope=whateverWeSet&token_type=typically'bearer'
      let accessT = responseBody.substr(13,40) //save in database as access_token. may want to save scope as well!!
    res.send(`your token has been grabbed BRUH!`); //REDIRECT BACK TO APP LOGIN OR WHATEVER
  });
});

module.exports = router;