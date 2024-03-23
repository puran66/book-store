const express = require('express');
const { bookStoreController } = require('../controller');
const { userAutheticate, auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/book-store', userAutheticate, bookStoreController.bookStore)
router.get('/addBook', userAutheticate, auth(["ADMIN"]), bookStoreController.addBookPage)
router.get('/delete-book/:id', userAutheticate, auth(["ADMIN"]), bookStoreController.deleteBook)
router.post('/addBook', userAutheticate, auth(["ADMIN"]), upload.single('bookImage'), bookStoreController.addBook)
router.get('/profile', userAutheticate, bookStoreController.profile)
router.get('/edit-profile', userAutheticate, bookStoreController.editProfile)
router.post('/update-profile', userAutheticate, upload.single('profileImage'), bookStoreController.updateProfile)
router.get('/otpValidate', userAutheticate, bookStoreController.otpPage)
router.get('/generate_otp', userAutheticate, bookStoreController.sendOtp);
router.post('/change_password', userAutheticate, bookStoreController.changePasswordpage)
router.post('/new_password', userAutheticate, bookStoreController.changePassword)
router.get('/cart', userAutheticate, auth(["USER"]), bookStoreController.showCart)
router.get('/addCartItems/:id', userAutheticate, auth(["USER"]), bookStoreController.addCartItems)
router.get('/cart-quantity-plus/:id', userAutheticate, bookStoreController.addQuantity)
router.get('/cart-quantity-minus/:id', userAutheticate, bookStoreController.minusQuantity)
router.get('/delete-cart-item/:id', userAutheticate, auth(["USER"]), bookStoreController.removeFromCart)
router.get('/payment', userAutheticate, auth(["USER"]), bookStoreController.paymentPage)
router.get('/thank-you', userAutheticate, auth(["USER"]), bookStoreController.thankYou)

module.exports = router;
