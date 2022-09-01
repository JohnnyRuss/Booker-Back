const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');
const { signToken, verifyToken } = require('../utils/JWT');
const User = require('../models/User');
const Refresher = require('../models/refresher');

exports.registerUser = asyncWrapper(async (req, res, next) => {
  const { body } = req;

  const user = {
    userName: body.userName,
    email: body.email,
    password: body.password,
  };

  const newUser = await User.create(user);

  const refreshToken = await signToken(res, { id: newUser._id, role: newUser.role });

  newUser.password = undefined;
  newUser.role = undefined;

  res.status(201).json({ status: 'success', data: { newUser, refreshToken } });
});

exports.logInUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const { authorization } = req.cookies;

  if (authorization) return next(new AppError(404, 'you are already authorized'));

  if (!email || !password)
    return next(new AppError(404, 'please provide us your email and password'));

  const user = await User.findOne({ email }).select('+password');

  const checkedPassword = await user.checkPassword(password, user.password);

  if (!user || !checkedPassword) return next(new AppError(404, 'incorect email or password'));

  const refreshToken = await signToken(res, { id: user._id, role: user.role });

  user.password = undefined;
  user.role = undefined;

  res.status(200).json({ status: 'success', data: { user, refreshToken } });
});

exports.logOutUser = asyncWrapper(async (req, res, next) => {
  const { authorization } = req.headers;
  const refresher = authorization.split(' ')[1];

  res.clearCookie('authorization');

  await Refresher.findOneAndDelete({ refresher });

  res.status(201).json({ status: 'success', data: null });
});

exports.refreshToken = asyncWrapper(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer '))
    return next(new AppError(401, 'you are not authorized '));

  const refresher = authorization.split(' ')[1];

  if (!refresher) return next(new AppError(401, 'you are not authorized'));

  const { id } = await verifyToken(refresher, true);

  const currUser = await User.findById(id);

  if (!currUser) return next(new AppError(403, 'user does not exists'));

  await Refresher.findOneAndDelete({ refresher });

  const refreshToken = await signToken(res, { id: currUser._id, role: currUser.role });

  res.status(200).json({ status: 'success', refreshToken });
});
