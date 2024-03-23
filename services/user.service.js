const { userSchema } = require("../model")
const jwt = require('jsonwebtoken')

const addUser = (name ,email,role, password, imgUrl) => {
  return userSchema.create({
    email: email,
    name: name,
    password: password,
    profileImage: imgUrl,
    role:role
  })
}

const isUser = (email) => {
  return userSchema.find({ email });
}

const findUser = (email, password) => {
  return userSchema.find({ email, password });
}

const createToken = (user) => {
  return jwt.sign({ user }, process.env.SECRETKEY);
}

const findId = (token) => {
  const user = jwt.verify(token, process.env.SECRETKEY)
  return user.user._id == undefined ? user.user[0]._id : user.user._id;
}

const findUserByToken = (token) =>{
  return jwt.verify(token,process.env.SECRETKEY)
}

module.exports = { addUser, findUser, createToken, isUser, findId ,findUserByToken}