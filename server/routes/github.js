const express = require('express');
const router = express.Router();

const request = require('request');
const qs = require('querystring');
const github = require('octonode');

//Environmental Variables
const env = require('dotenv').config();
const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;

let targetURL_Repo = `https://github.com/login/oauth/authorize?scope=repo&client_id=${GH_CLIENT_ID}`;
// let postURL = `https://github.com/login/oauth/access_token?${qs.stringify(body)}`;


router.get('/authorize', (req,res) => {
  
  res.redirect(targetURL_Repo);
});

router.get('/callback', ( req, res ) => {
     console.log('authorized now redirecting...');     
  let body = {
    client_id: GH_CLIENT_ID, 
    client_secret: GH_CLIENT_SECRET, 
    code: req.query.code
  };

  console.log('going to post now')

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