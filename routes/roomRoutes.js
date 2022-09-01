const express = require('express');

const {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getAllRoom,
  updateRoomAvailability,
  getHotelRooms,
} = require('../controllers/roomController');
const { verifyToken, verifyUser, verifyAdmin } = require('../controllers/protectRoutes');

const router = express.Router();

router.route('/').get(getAllRoom);

router.route('/hotel/:id').get(verifyToken, getHotelRooms);

router.route('/:id/addDates').put(verifyToken, updateRoomAvailability);

router
  .route('/:id')
  .post(verifyToken, verifyAdmin, createRoom)
  .put(verifyToken, verifyAdmin, updateRoom)
  .delete(verifyToken, verifyAdmin, deleteRoom)
  .get(getRoom);

module.exports = router;
