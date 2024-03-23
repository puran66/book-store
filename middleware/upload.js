const multer = require('multer')
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.join(__dirname,'../public/images'));
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname);
  }
})

const upload = multer({storage});

module.exports = upload;