const { Schema, model } = require('mongoose');

const HotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  location: {
    type: {
      country: String,
      city: String,
      adress: String,
      distanceFromCenter: Number,
    },
    required: true,
  },
  features: {
    type: [String],
  },
  images: {
    type: {
      url: [String],
      optimized: [String],
    },
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: {
      point: { type: Number, min: 0, max: 10 },
      rate: String,
    },
  },
  rooms: {
    type: [String],
  },
  minPrice: {
    type: Number,
    required: true,
  },
  maxPrice: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

const Hotel = model('Hotel', HotelSchema);
module.exports = Hotel;
