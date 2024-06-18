const express = require("express");
const { validationSchema } = require("../middlewares/validationSchema");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");

const coursesController = require("../controllers/courses.controllers");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(
    verifyToken,
    allowedTo(userRoles.MANGER),
    validationSchema(),
    coursesController.addCourse
  );

router
  .route("/:courseID")
  .get(coursesController.getCourse)
  .patch(coursesController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANGER),
    coursesController.deleteCourse
  );

module.exports = router;
