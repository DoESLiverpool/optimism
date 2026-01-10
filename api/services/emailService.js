const nodemailer = require('nodemailer');
const fs = require('fs');
const moment = require('moment');

// Read in the email config from environment variables or secrets
// Priority: Environment variables > Docker secrets > Default
var email_user = process.env.OPTIMISM_EMAIL_USER || 'NEED TO SET EMAIL USER';
var email_pass = process.env.OPTIMISM_EMAIL_PASS || 'NEED TO SET EMAIL PASS';
const email_user_path = '/run/secrets/email_user';
const email_pass_path = '/run/secrets/email_pass';
if (fs.existsSync(email_user_path)) {
  email_user = fs.readFileSync(email_user_path, { encoding: 'utf8' }).trim();
}
if (fs.existsSync(email_pass_path)) {
  email_pass = fs.readFileSync(email_pass_path, { encoding: 'utf8' }).trim();
}

// SMTP configuration from environment variables
const smtpHost = process.env.OPTIMISM_SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.OPTIMISM_SMTP_PORT || '587', 10);
const smtpSecure = process.env.OPTIMISM_SMTP_SECURE === 'true';

// Create transporter
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: email_user,
    pass: email_pass
  }
});

/**
 * Sends a booking confirmation email to the user
 * @param {Object} booking - The booking object with all booking details
 * @param {string} cancellationUrl - The full URL to cancel the booking
 * @returns {Promise} Promise that resolves when email is sent
 */
async function sendBookingConfirmationEmail (booking, cancellationUrl) {
  // Get resource name - booking should have resource info or we need to fetch it
  const resourceName = booking.resourceName || 'your booking';

  // Format dates
  const startTime = moment(booking.starts).format('dddd, MMMM Do YYYY, h:mm a');
  const endTime = moment(booking.ends).format('dddd, MMMM Do YYYY, h:mm a');

  const subject = `Booking Confirmation - ${resourceName}`;

  const text = `Welcome ${booking.name}!

Your booking has been confirmed.

Booking Details:
- Resource: ${resourceName}
- Start: ${startTime}
- End: ${endTime}
${booking.notes ? `- Notes: ${booking.notes}` : ''}

If you need to cancel this booking, please use the following link:
${cancellationUrl}

Thank you for your booking!`;

  const mailOptions = {
    from: email_user,
    to: booking.email,
    subject: subject,
    text: text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  sendBookingConfirmationEmail
};

