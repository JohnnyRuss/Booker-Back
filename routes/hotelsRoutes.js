const express = require('express');

const {
  createHotel,
  getHotel,
  getAllHotels,
  updateHotel,
  deleteHotel,
  countByCity,
  countByType,
  uploadImages,
  deleteHotelImage,
  resizeAndOptimiseMedia,
  getByCity,
  getByType,
  getTop4Rated,
} = require('../controllers/hotelController');
const { verifyToken, verifyAdmin } = require('../controllers/protectRoutes');

const router = express.Router();

router.route('/').post(verifyToken, verifyAdmin, uploadImages, resizeAndOptimiseMedia, createHotel);

router.route('/all').get(getAllHotels);

router.route('/topRated').get(getTop4Rated);

router.route('/getByCity').get(getByCity);

router.route('/getByType').get(getByType);

router.route('/countByCity').get(countByCity);

router.route('/countByType').get(countByType);

router.route('/:id/image').delete(verifyToken, verifyAdmin, deleteHotelImage);

router
  .route('/:id')
  .get(getHotel)
  .put(verifyToken, verifyAdmin, uploadImages, resizeAndOptimiseMedia, updateHotel)
  .delete(verifyToken, verifyAdmin, deleteHotel);

module.exports = router;
