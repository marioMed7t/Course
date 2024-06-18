const User = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateJWT = require("../utils/generateJWT");
const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  //get all courses from database using course model
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "user already Exists",
      400,
      httpStatusText.FAIL
    ); //new Error();
    return next(error);
  }

  // hashing password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  //generate jwt
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  console.log(token);
  newUser.token = token;

  await newUser.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { User: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create(
      "Email and password are required",
      400,
      httpStatusText.FAIL
    ); //new Error();
    return next(error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create("user not found", 400, httpStatusText.FAIL); //new Error();
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (matchedPassword) {
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create(
      "password is wrong",
      500,
      httpStatusText.ERROR
    ); //new Error();
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
