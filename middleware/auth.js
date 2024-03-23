const jwt = require('jsonwebtoken')

const userAutheticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.redirect('/v1/login')
    }

    const verified = jwt.verify(token, process.env.SECRETKEY);

    // console.log(verified.user[0]);

    req.user = verified.user[0] == undefined ? verified.user : verified.user[0]

    next();

  }
  catch (err) {
    console.log(err);
  }
}

const auth = ([...role]) =>{

  return (req,res,next)=>{
    const user = req.user
    // console.log(user);

    if(role.includes(user.role)){
        next()
    }else{
        res.status(403).redirect('/book-store')
    }
  }
}

module.exports = {userAutheticate,auth}