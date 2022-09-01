const express = require('express');

const { updateUser, getUser, getAllUser, deleteUser } = require('../controllers/userController');
const { verifyToken, verifyUser, verifyAdmin } = require('../controllers/protectRoutes');

const router = express.Router();

router.route('/').get(verifyToken, verifyAdmin, getAllUser);

router
  .route('/:id')
  .get(verifyToken, verifyUser, getUser)
  .put(verifyToken, verifyUser, updateUser)
  .delete(verifyToken, verifyUser, deleteUser);

module.exports = router;
