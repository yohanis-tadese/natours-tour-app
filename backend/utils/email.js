const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Read and compile the email template
  const templatePath = path.join(
    __dirname,
    '../email-templates/passwordResetEmail.ejs'
  );
  const template = fs.readFileSync(templatePath, 'utf-8');
  const html = ejs.render(template, { resetURL: options.resetURL });

  // 3) Define the email options
  const mailOptions = {
    from: '<yohanistadese06@gmail.com>',
    to: options.email,
    subject: options.subject,
    html,
  };

  // 4) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('There was an error sending the email. Try again later!');
  }
};

module.exports = sendEmail;
