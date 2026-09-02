const nodemailer = require("nodemailer");

module.exports.sendMail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });

  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: subject,
    html: html,
  });
}

