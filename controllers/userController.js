const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/User');

exports.updateUser = asyncWrapper(async (req, res, next) => {
  //prettier-ignore
  const { params:{ id }, body } = req

  const updatedUser = await User.findByIdAndUpdate(id, { $set: body }, { new: true });

  if (!updatedUser) return next(new AppError(404, 'user does not exist'));

  res.status(200).json({ status: 'success', data: updatedUser });
});

exports.getUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) return next(new AppError(404, 'user does not exist'));

  res.status(200).json({ status: 'success', data: user });
});

exports.getAllUser = asyncWrapper(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ status: 'success', data: users });
});

exports.deleteUser = asyncWrapper(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) return next(new AppError(404, 'user does not exist'));

  res.status(204).json({ status: 'success', data: null });
});
