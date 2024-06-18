const express = require("express");
const cors = require("cors");
const app = express();
const httpStatusText = require("./utils/httpStatusText");
const userRouter = require("./routes/Users.route");
require("dotenv").config();

const url = process.env.MONGO_URL;
const mongoose = require("mongoose");
const Path = require("path");
mongoose.connect(url).then(() => console.log("monogodb server started"));
console.log(Path.join(__dirname, "uploads"));
app.use(cors());
app.use("/uploads", express.static(Path.join(__dirname, "uploads")));

app.use(express.json());

const courseRouter = require("./routes/courses.route");
app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.all("*", (req, res) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    mssage: "this resourse is not avilable",
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("listening on port: 5000");
});

// * mario
// ! mario
