const express = require('express');
const router = express.Router();

const githubRoute = require('./github');

//middleware routing
router.use('/github', githubRoute);

module.exports = router;
