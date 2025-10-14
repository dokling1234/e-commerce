const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS, 
    },
      tls: {
    rejectUnauthorized: false, 
  },
  },
);

module.exports = transporter;