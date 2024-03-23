const mongoose = require("mongoose");
const { BookSchema, userSchema, userCartSchema } = require("../model")
const jwt = require('jsonwebtoken')

const addBook = (body, bookimg, userId) => {
  const book = {
    bookName: body.bookName,
    bookImage: bookimg,
    bookPrice: body.bookPrice,
    publisher: userId,
  }
  return BookSchema.create(book);
}

const getData = () => {
  return BookSchema.find({});
}

const getProfile = (token) => {
  return jwt.verify(token, process.env.SECRETKEY);
}

const updateProfile = (body, profileImage) => {
  return userSchema.findByIdAndUpdate({ _id: body._id }, {
    name: body.name,
    profileImage: profileImage,
    email: body.email,
    password: body.password
  })
}

const updateToken = (user) => {

  const token = jwt.sign({ user }, process.env.SECRETKEY);

  return token;
}

const findImage = (_id) => {
  const user = userSchema.find({ _id });

  return user;
}

const getEmail = (token) => {
  const user = jwt.verify(token, process.env.SECRETKEY);
  // console.log(user.user.email);
  return user.user.email == undefined ? user.user[0].email : user.user.email;
}

const getId = (token) => {
  const user = jwt.verify(token, process.env.SECRETKEY);
  // console.log(user.user.email);
  return user.user._id == undefined ? user.user[0]._id : user.user._id;
}

const updatePassword = (id, newPassword) => {
  return userSchema.findByIdAndUpdate({ _id: id }, { password: newPassword })
}

const getItem = (_id) => {
  return BookSchema.find({ _id })
}

const addCartItem = (cartItem) => {
  return userCartSchema.create(cartItem);
}
const countTotalItems = () => {
  return userCartSchema.find({}).populate('user')
}

const updateQuantity = (bookName, bookImage, bookPrice) => {
  return userCartSchema.findOneAndUpdate({ itemIamge: bookImage, itemName: bookName, itemPrice: bookPrice }, { $inc: { quantity: 1 } });
}

const addQuantity = (_id) => {
  return userCartSchema.findByIdAndUpdate({ _id }, { $inc: { quantity: 1 } })
}

const minusQuantity = (_id) => {
  return userCartSchema.findByIdAndUpdate({ _id }, { $inc: { quantity: -1 } })
}

const deleteCart = () => {
  return userCartSchema.deleteMany({})
}

const removeFromCart = (_id) => {
  return userCartSchema.findByIdAndDelete({ _id })
}

const deleteBook = (_id) =>{
  return BookSchema.findByIdAndDelete({_id});
}
module.exports = { addBook, getData, getProfile, updateProfile, updateToken, findImage, getEmail, getId, updatePassword, getItem, addCartItem, countTotalItems, updateQuantity, addQuantity, deleteCart, minusQuantity, removeFromCart ,deleteBook }