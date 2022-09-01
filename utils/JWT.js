const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const Refresher = require('../models/refresher');

exports.signToken = async (res, payload) => {
  const SECRET = process.env.JWT_SECRET;
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  const EXPIRES = process.env.JWT_EXPIRES;
  const accessToken = JWT.sign(payload, SECRET, { expiresIn: EXPIRES });
  const refreshToken = JWT.sign(payload, REFRESH_SECRET);

  await Refresher.create({ refresher: refreshToken });

  res.cookie('authorization', accessToken, {
    httpOnly: true,
  });

  return refreshToken;
};

exports.verifyToken = async function (token, refresh = false) {
  let SECRET;

  if (refresh) SECRET = process.env.JWT_REFRESH_SECRET;
  if (!refresh) SECRET = process.env.JWT_SECRET;

  const verification = promisify(JWT.verify);
  return await verification(token, SECRET);
};
