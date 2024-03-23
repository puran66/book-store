const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  itemIamge : {
    type : String,
    required:true
  },
  itemName : {
    type : String,
    required:true
  },
  itemPrice : {
    type : String,
    required:true
  },
  quantity : {
    type : Number,
    required:true,
    default : 1
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})

const userCart = mongoose.model('userCart',cartSchema);

module.exports = userCart;