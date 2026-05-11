const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config(); //!loading environment variable

const sendEmail = async (to, resetToken) => {
  try {
    //create a tranport object
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.APP_PWD,
      },
    });

    //create message
    const message = {
      // from: process.env.GMAIL_USER,
      to: to,
      subject: "Password Reset Token",
      html: `<p>You requested for password reset. Click <a href="http://localhost:3000/reset-password/${resetToken}">here</a>  to reset your password</p> <h1>${resetToken}</h1>`,
    };
    //send email
    const info = await transport.sendMail(message);
    console.log("Email sent", info.messageId);
  } catch (error) {
    console.log("Error in sending email", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
