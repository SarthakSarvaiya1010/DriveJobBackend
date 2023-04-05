const multer = require("multer");
const path = require("path");

const uploads = multer({
  limits: {
    fileSize: 307200,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});

module.exports = {
  upload: uploads,
};
