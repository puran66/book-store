const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "iphonexrpuran@gmail.com",
    pass: `${process.env.EMAILPASSWORD}`,
  },
});


let sendEmail = (to,subject,data)=>{

  return  transporter.sendMail({
        from: '"Test 👻" <iphonexrpuran@gmail.com>', // sender address
        to: to ,// list of receivers
        subject: subject, // Subject line
        html: data, // html body
      });


}

module.exports = sendEmail;