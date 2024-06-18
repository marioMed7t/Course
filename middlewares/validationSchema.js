const { body } = require("express-validator");
const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is Required")
      .isLength({ min: 2 })
      .withMessage("title at least is 2"),
    body("price").notEmpty().withMessage("price is Required"),
  ];
};
module.exports = {
  validationSchema,
};
