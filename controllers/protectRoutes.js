const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');
const { verifyToken } = require('../utils/JWT');

exports.verifyToken = asyncWrapper(async (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) return next(new AppError(401, 'you are not authenticated'));

  const payload = await verifyToken(authorization);

  req.user = payload;

  next();
});

exports.restrict = (...roles) =>
  asyncWrapper(async (req, res, next) => {
    const currUser = req.user;

    if (roles.includes(currUser.role))
      return next(new AppError(401, 'you are not authorized for this operation'));

    next();
  });

exports.verifyUser = asyncWrapper(async (req, res, next) => {
  const currUser = req.user;
  const { id } = req.params;

  if (id !== currUser.id)
    return next(new AppError(401, 'you are not authorized for this operation'));

  next();
});

exports.verifyAdmin = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  if (user.role !== 'admin')
    return next(new AppError(401, 'you are not authorized for this operation'));

  next();
});
