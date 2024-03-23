const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profileImage:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  role:{
    type: String,
    enum: ['USER', 'ADMIN'],
    default:'USER'
  },
  password:{
    type:String,
    required: true
  }
})

const  User = mongoose.model("User",userSchema);
module.exports= User;