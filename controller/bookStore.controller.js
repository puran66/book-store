const { bookStoreServices, userServices, emailServices } = require("../services");
const otpGenerator = require('otp-generator');
const sendEmail = require("../services/email.service");
const session = require('express-session');
const imageUpload = require("../helper/cloudinary");

const bookStore = async (req, res) => {
  try {
    const token = req.cookies.token;
    // console.log(token);

    if (!token) {
      throw new Error("login first!")
    }
    const user = await userServices.findUserByToken(token);
    // console.log(user);
    const profileImage = user.user.profileImage == undefined ? user.user[0].profileImage : user.user.profileImage;
    const role = user.user.role == undefined ? user.user[0].role : user.user.role;
    // console.log(profileImage, role);

    const data = await bookStoreServices.getData();
    // console.log(data);

    const Items = await bookStoreServices.countTotalItems();
    let totalItems = 0;

    Items.map((item) => {
      totalItems += item.quantity;
    })
    // console.log(totalItems);

    res.status(200).render('bookStore', { data: data, profileImage: profileImage, totalItems: totalItems ,role:role })
  }
  catch (err) {
    console.log(err);
  }
}

const addBookPage = async (req, res) => {
  try {
    res.status(200).render('addBook')
  }
  catch (err) {
    console.log(err);
  }
}

const deleteBook =async (req,res) =>{
  try {
    const id = req.params.id;

    const deleted = await bookStoreServices.deleteBook(id);

    res.status(200).redirect('/book-store')
  } catch (error) {
    console.log(error);
  }
}

const addBook = async (req, res) => {
  try {
    const body = req.body;
    const img = req.file.path;
    const token = req.cookies.token;

    // console.log(body,img);
    if (!body || !img || !token) {
      throw new Error("Missing Data");
    }

    const bookImage = await imageUpload(img);

    // console.log(imgUrl.url);

    const userId = await userServices.findId(token);

    const book = await bookStoreServices.addBook(body, bookImage.url, userId);

    res.status(201).redirect('/book-store');
  }
  catch (err) {
    console.log(err);
  }
}

const profile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("login first");
    }

    const getUser = await bookStoreServices.getProfile(token);
    const user = getUser.user[0] == undefined ? getUser.user : getUser.user[0]
    // console.log(user);
    const profileImage = user.profileImage;


    res.status(200).render('profilePage', { user: user, profileImage: profileImage })
  }
  catch (err) {
    console.log(err);
  }
}

const editProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("login first");
    }

    const getUser = await bookStoreServices.getProfile(token);
    const user = getUser.user[0] == undefined ? getUser.user : getUser.user[0]
    // console.log(user);

    const profileImage = user.profileImage;
    // console.log(profileImage);

    res.status(200).render('editProfile', { user, profileImage: profileImage })
  }
  catch (err) {
    console.log(err);
  }
}

const updateProfile = async (req, res) => {
  try {
    const body = req.body;
    const img = req.file.path
    // console.log(body, img);
    if (!body || !img) {
      throw new Error("inputs required")
    }

    const profileImage = await imageUpload(img)
    // console.log(profileImage);

    const updated = await bookStoreServices.updateProfile(body, profileImage.url);

    const updatedBody = {
      _id: body._id,
      profileImage: profileImage.url,
      name: body.name,
      email: body.email,
      password: body.password
    }
    // console.log(updatedBody);

    const updateToken = await bookStoreServices.updateToken(updatedBody);

    // console.log(updateToken);

    res.status(200).cookie('token', updateToken).redirect('/profile');

    // // res.status(201).redirect('/profile');
  }
  catch (err) {
    console.log(err.message);
  }
}

const otpPage = async (req, res) => {
  try {
    res.status(200).render('otpValidate', { message: "", style: "" })
  }
  catch (err) {
    console.log(err);
  }
}

const sendOtp = async (req, res) => {
  try {
    const token = req.cookies.token;

    const email = await bookStoreServices.getEmail(token);
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: false });

    const senddata = await sendEmail(email, 'change password otp', otp);
    // console.log(senddata);

    req.session.otp = otp;

    res.status(200).render('otpValidate', { message: "OTP has been sent successfully to your registered email.", style: "text-green-500 mt-2" })
  }
  catch (err) {
    console.log(err);
  }
}

const changePasswordpage = (req, res) => {
  try {
    const inputOtp = req.body.otp;
    // console.log(body);
    if (!inputOtp) {
      throw new Error("otp required...")
    }

    const otp = req.session.otp;
    // console.log(inputOtp,otp);

    if (inputOtp) {
      return res.status(200).render('changePassword', { message: "", style: "" });
    } else {
      return res.status(404).render('otpValidate', { message: 'Invalid OTP', style: "text-red-500 mt-2" });
    }
  } catch (err) {
    console.log(err);
  }
}

const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const token = req.cookies.token;
    // console.log(newPassword, token);

    if (!token) {
      throw new Error("token not found!")
    }

    const id = bookStoreServices.getId(token);
    // console.log(id);

    if (newPassword === confirmPassword) {
      const updatePass = await bookStoreServices.updatePassword(id, newPassword);
      console.log(updatePass);
      res.status(200).render('changePassword', { message: "Your password has been changed successfully!", style: "text-green-500 mt-2" });
    } else {
      res.status(400).render('changePassword', { message: "password doesn't match!", style: "text-red-500 mt-2" });
    }
  }
  catch (err) {
    console.log(err);
  }
}

const showCart = async (req, res) => {
  try {
    const Items = await bookStoreServices.countTotalItems();
    const token = req.cookies.token;
    // console.log(newPassword, token);

    if (!token) {
      throw new Error("token not found!")
    }

    const _id = bookStoreServices.getId(token);
    // console.log(_id);
    const cartItems = Items.filter((item) => {
      return item.user._id.toString() === _id;
    });
    // console.log(cartItems);


    let totalPrice = 0;

    cartItems.map((item) => {
      totalPrice += item.itemPrice * item.quantity;
    })

    let gst = totalPrice * 18 / 100;

    let shipping = 100;

    let emptyCart = "";

    if (totalPrice === 0 && gst === 0) {
      emptyCart = "Your Cart is Empty";
    }

    let finalPrice = parseFloat(gst + shipping + totalPrice).toFixed(2)

    // console.log(totalPrice, gst, shipping, finalPrice);

    res.status(200).render('cart', { cartItems: cartItems, totalPrice, gst, shipping, finalPrice, emptyCart })
  }
  catch (err) {
    console.log(err);
  }
}

const addCartItems = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);

    const book = await bookStoreServices.getItem(id);
    const item = book[0] === undefined ? book : book[0];
    // console.log(item);

    const token = req.cookies.token;
    // console.log(newPassword, token);

    if (!token) {
      throw new Error("token not found!")
    }

    const _id = bookStoreServices.getId(token);
    // console.log(_id);

    const cartItems = await bookStoreServices.countTotalItems();
    // console.log(cartItems);

    if (cartItems.some(element => element.itemIamge === item.bookImage && element.itemName === item.bookName)) {
      // console.log(true);
      const updateQuantity = await bookStoreServices.updateQuantity(item.bookName, item.bookImage, item.bookPrice)
      // console.log(updateQuantity);
    } else {
      const cartItem = {
        itemIamge: item.bookImage,
        itemName: item.bookName,
        itemPrice: item.bookPrice,
        quantity: 1,
        user: _id
      }
      // console.log(cartItem);
      const addedCartItems = await bookStoreServices.addCartItem(cartItem)
      // console.log(addedCartItems);

    }

    res.status(200).redirect('/book-store')
  }
  catch (err) {
    console.log(err);
  }
}

const addQuantity = async (req, res) => {
  try {
    const id = req.params.id;

    const addplus = await bookStoreServices.addQuantity(id)

    if (addplus) {
      res.status(200).redirect('/cart')
    } else {
      throw new Error("Something went wrong!");
    }
  }
  catch (err) {
    console.log(err);
  }
}

const minusQuantity = async (req, res) => {
  try {
    const id = req.params.id;

    const minus = await bookStoreServices.minusQuantity(id)

    if (minus) {
      res.status(200).redirect('/cart')
    } else {
      throw new Error("Something went wrong!");
    }
  }
  catch (err) {
    console.log(err);
  }
}

const paymentPage = async (req, res) => {
  try {
    const cartItems = await bookStoreServices.countTotalItems()
    // console.log(cartItems);

    let totalPrice = 0;

    cartItems.map((item) => {
      totalPrice += item.itemPrice * item.quantity;
    })

    let gst = totalPrice * 18 / 100;

    let shipping = 100;

    let finalPrice = parseFloat(gst + shipping + totalPrice).toFixed(2)
    res.status(200).render('payment', { finalPrice });
  }
  catch (err) {
    console.log(err);
  }
}

const thankYou = async (req, res) => {
  try {
    const deleteCart = await bookStoreServices.deleteCart();

    res.status(200).render('thankYou')
  } catch (error) {
    console.log(error);
  }
}

const removeFromCart = async (req, res) => {
  try {
    const _id = req.params.id;

    const removeItem = await bookStoreServices.removeFromCart(_id)

    if (removeItem) {
      res.status(200).redirect('/cart');
    } else {
      throw new Error("can't remove item from cart")
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = { bookStore, addBookPage, addBook, profile, editProfile, updateProfile, otpPage, sendOtp, changePasswordpage, changePassword, showCart, addCartItems, addQuantity, minusQuantity, paymentPage, thankYou, removeFromCart ,deleteBook };