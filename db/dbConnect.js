const mongoose = require('mongoose');

const dbConnect = () => {
  mongoose.connect(process.env.DB).then(() => {
    console.log("db connected");
  }).catch((err) => {
    console.log(err, "from db connect");
  })
}

module.exports = dbConnect
