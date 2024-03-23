const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookName:{
    type:String,
    required:true
  },
  bookImage:{
    type: String,
    required:true
  },
  bookPrice:{
    type:String,
    required:true
  },
  publisher:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})

const Book = mongoose.model('Book',bookSchema);

module.exports = Book;