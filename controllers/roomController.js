const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

exports.createRoom = asyncWrapper(async (req, res, next) => {
  //prettier-ignore
  const {params:{ id }, body} = req

  body.hotel = id;

  const room = await Room.create(body);

  await Hotel.findByIdAndUpdate(id, { $push: { rooms: room._id } });

  res.status(200).json({ status: 'success', data: room });
});

exports.updateRoom = asyncWrapper(async (req, res, next) => {
  //prettier-ignore
  const {params:{ id }, body} = req

  const room = await Room.findByIdAndUpdate(id, { $set: body }, { new: true });

  res.status(200).json({ status: 'success', data: room });
});

exports.updateRoomAvailability = asyncWrapper(async (req, res, next) => {
  //prettier-ignore
  const {params:{id}, body:{dates}} = req

  await Room.updateOne(
    { 'roomNumbers._id': id },
    {
      $push: {
        'roomNumbers.$.unavailableDates': dates,
      },
    }
  );

  res.status(200).json('Room status has been updated.');
});

exports.deleteRoom = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  await Room.findByIdAndDelete(id);

  await Hotel.findByIdAndUpdate(id, { $pull: { rooms: id } });

  res.status(204).json({ status: 'success', data: null });
});

exports.getRoom = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const room = await Room.findById(id);

  res.status(200).json({ status: 'success', data: room });
});

exports.getHotelRooms = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const rooms = await Room.find({ hotel: id });

  res.status(200).json({ status: 'success', data: rooms });
});

exports.getAllRoom = asyncWrapper(async (req, res, next) => {
  const rooms = await Room.find();

  res.status(200).json({ status: 'success', data: rooms });
});
