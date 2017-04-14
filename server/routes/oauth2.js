const express = require('express');
const router = express.Router();

const githubRoute = require('./github');

//middleware routing for each API here:
router.use('/github', githubRoute);

module.exports = router;
