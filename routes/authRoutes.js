const express = require('express');

const {
  registerUser,
  logInUser,
  logOutUser,
  refreshToken,
} = require('../controllers/authenticationController');

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(logInUser);

router.route('/logout').post(logOutUser);

router.route('/refresh').post(refreshToken);

module.exports = router;
