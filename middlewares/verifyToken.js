const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    const error = appError.create(
      "token is required",
      401,
      httpStatusText.ERROR
    ); //new Error();
    return next(error);
  }
  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.jWT_SECRET_KEY);
    req.currentUser = decodedToken;
    next();
  } catch (err) {
    const error = appError.create("invalid token", 401, httpStatusText.ERROR); //new Error();
    return next(error);
  }
};

module.exports = verifyToken;
