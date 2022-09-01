const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const RoomSchema = new Schema(
  {
    hotel: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
  },
  { timestamps: true }
);

const Room = model('Room', RoomSchema);

module.exports = Room;
