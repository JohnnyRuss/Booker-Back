const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');
const { uploadMedia, editMedia } = require('../utils/multer');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const fs = require('fs');
const { promisify } = require('util');
const API_Features = require('../utils/apiFeatures');

exports.uploadImages = uploadMedia({
  storage: 'memoryStorage',
  upload: 'any',
  filename: 'images',
});

exports.resizeAndOptimiseMedia = editMedia({
  multy: true,
});

exports.createHotel = asyncWrapper(async (req, res, next) => {
  const { body } = req;

  if (req.files) {
    // If multer storage is diskStorage use this
    // req?.files?.map((file) => file.filename);
    const originals = req.xOriginal;
    const optimized = req.x500;
    body.images = {
      url: originals,
      optimized: optimized,
    };
  }

  const hotel = await Hotel.create(body);

  res.status(200).json({ status: 'success', data: hotel });
});

exports.updateHotel = asyncWrapper(async (req, res, next) => {
  //prettier-ignore
  const { params:{id}, body } = req;

  if (req.files) {
    const originals = req.xOriginal;
    const optimized = req.x500;

    body.images = {
      url: originals.map((org) => `${req.protocol}://${req.hostname}/${org}`),
      // url: originals.map((org) => `${req.protocol}://localhost:6600/${org}`),
      optimized: optimized.map((org) => `${req.protocol}://${req.hostname}/${org}`),
      // optimized: optimized.map((org) => `${req.protocol}://localhost:6600/${org}`),
    };
  }

  const updatedHotel = await Hotel.findByIdAndUpdate(id, { $set: body }, { new: true });

  res.status(200).json({ status: 'success', data: updatedHotel });
});

exports.deleteHotelImage = asyncWrapper(async (req, res, next) => {
  //prettier-ignore
  const { params:{id}, body:{image}} = req

  const deletion = promisify(fs.unlink);

  await deletion(`public/assets/${image}`);

  await Hotel.findByIdAndUpdate(id, { $pull: { images: image } });

  res.status(204).json({ status: 'success', data: null });
});

exports.getHotel = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const hotel = await Hotel.findById(id);

  res.status(200).json({ status: 'success', data: hotel });
});

exports.getAllHotels = asyncWrapper(async (req, res, next) => {
  const { query } = req;

  const { DB } = new API_Features(Hotel.find(), query).filter().fields();

  const hotels = await DB;

  res.status(200).json({ status: 'success', data: hotels });
});

exports.deleteHotel = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  await Hotel.findByIdAndDelete(id);

  res.status(204).json({ status: 'success', data: null });
});

exports.getTop4Rated = asyncWrapper(async (req, res, next) => {
  const topRated = await Hotel.find()
    .select('rating images name location.city minPrice')
    .sort('-rating.point')
    .limit(4);

  res.status(200).json({ status: 'success', data: topRated });
});

exports.getByCity = asyncWrapper(async (req, res, next) => {
  const list = await Hotel.aggregate([
    {
      $group: {
        _id: '$location.city',
        city: { $first: '$location.city' },
        country: { $first: '$location.country' },
        image: { $first: '$images.url' },
        apartments: { $sum: 1 },
      },
    },
    { $limit: 5 },
    { $sort: { apartments: -1 } },
  ]);

  res.status(200).json({ status: 'success', data: list });
});

exports.getByType = asyncWrapper(async (req, res, next) => {
  const list = await Hotel.aggregate([
    {
      $group: {
        _id: '$type',
        image: { $first: '$images.optimized' },
        apartments: { $sum: 1 },
      },
    },
    { $limit: 6 },
    { $sort: { apartments: -1 } },
  ]);

  res.status(200).json({ status: 'success', data: list });
});

exports.countByCity = asyncWrapper(async (req, res, next) => {
  const { city } = req.query;

  const list = await Promise.all(
    city.split(',').map((city) => Hotel.countDocuments({ 'location.city': city }))
  );

  res.status(200).json({ status: 'success', data: list });
});

exports.countByType = asyncWrapper(async (req, res, next) => {
  const { type } = req.query;

  const list = await Promise.all(type.split(',').map((type) => Hotel.countDocuments({ type })));

  res.status(200).json({ status: 'success', data: list });
});
