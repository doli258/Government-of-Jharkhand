const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // You can also use SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: `"Grievance Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
}
// Complaint notification email
async function complaintEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: `"Grievance Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
}

module.exports = sendEmail;
module.exports = complaintEmail;
