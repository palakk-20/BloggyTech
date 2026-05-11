const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config(); //!loading environment variable

const sendVerificationEmail = async (to, verificationToken) => {
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
      subject: "Account Verification Token",
      html: `<p>Please verify your account by clicking the link below.</p>
            </br>
            <button><a href="http://localhost:3000/verify-account/${verificationToken}">Verify Account</a></button></br>
            <h1>${verificationToken}</h1>`,
    };
    //send email
    const info = await transport.sendMail(message);
    // console.log("Email sent", info.messageId);
  } catch (error) {
    console.log("Error in sending email", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendVerificationEmail;
