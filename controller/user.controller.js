const { userServices } = require("../services");

const signUpPage = (req, res) => {
  try {
    res.status(200).render('userSignUp');
  }
  catch (err) {
    console.log(err, "Error in Admin Login");
  }
}

const createAdminPage = (req, res) => {
  try {
    res.status(200).render('createAdmin',{msg:""});
  }
  catch (err) {
    console.log(err, "Error in create admin page");
  }
}

const logout = (req, res) => {
  try {
    res.clearCookie('token').redirect('/v1/login');
  }
  catch (err) {
    console.log(err);
  }
}

const signUp = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const imgUrl = req.file.path;

    if (!email || !password || !name) {
      throw new Error("email and password required");
    }

    const profileImage = imgUrl.replace(/\\/g, "/").replace("D:/Full Stack Development/book-store-detail/public", "http://localhost:8000/");

    const isUser = await userServices.isUser(email);

    if (isUser == []) {
      throw new Error("email already used!")
    }

    const user = await userServices.addUser(name, email, role, password, profileImage);
    // console.log(user,"this is the user dataa");

    res.status(201).redirect('/v1/login')
  }
  catch (err) {
    console.log(err.message);
  }
}

const createAdmin = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const imgUrl = req.file.path;
    // console.log(role);

    if (!email || !password || !name) {
      throw new Error("email and password required");
    }

    const profileImage = imgUrl.replace(/\\/g, "/").replace("D:/Full Stack Development/book-store-detail/public", "http://localhost:8000/");

    const isUser = await userServices.isUser(email);

    if (isUser == []) {
      throw new Error("email already used!")
    }

    const user = await userServices.addUser(name, email, role, password, profileImage);
    // console.log(user,"this is the user dataa");

    res.status(201).render('createAdmin', { msg: "Account created successfully!" })
  }
  catch (err) {
    console.log(err.message);
  }
}



const loginPage = (req, res) => {
  try {
    res.status(200).render('userLogin')
  }
  catch (err) {
    console.log(err);
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("email and password required");
    }

    const isUser = await userServices.isUser(email);
    // console.log(isUser);

    if (isUser != []) {
      const token = userServices.createToken(isUser);

      res.status(200).cookie("token", token).redirect('/book-store');
    } else {
      throw new Error("user not found! login first!")
    }

  }
  catch (err) {
    console.log(err);
  }
}

module.exports = { signUpPage, signUp, login, logout, loginPage, createAdmin ,createAdminPage }