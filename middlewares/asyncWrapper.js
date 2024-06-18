module.exports = (asyncfn) => {
  return (req, res, next) => {
    asyncfn(req, res, next).catch((err) => {
      next(err);
    });
  };
};
// async (req, res) => {
//     const course = await Course.findById(req.params.courseID);
//     if (!course) {
//       return res.status(404).json({
//         status: httpStatusText.FAIL,
//         data: { course: "Course not found" },
//       });
//     }
//     return res.json({ status: httpStatusText.SUCCESS, data: { course } });
