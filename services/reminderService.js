const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');

// Configure transporter for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send reminder email
const sendReminderEmail = async (reminder) => {
  try {
    // Populate event and user details
    await reminder.populate([
      { path: 'event' },
      { path: 'user', select: 'name email' }
    ]);

    // Calculate time difference
    const eventDate = new Date(reminder.event.date);
    const now = new Date();
    const diffTime = Math.abs(eventDate - now);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    // Create time message
    let timeMessage = '';
    if (diffDays > 0) {
      timeMessage += `${diffDays} day${diffDays !== 1 ? 's' : ''} `;
    }
    if (diffHours > 0) {
      timeMessage += `${diffHours} hour${diffHours !== 1 ? 's' : ''} `;
    }
    if (diffMinutes > 0) {
      timeMessage += `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} `;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: reminder.user.email,
      subject: `Reminder: ${reminder.event.name}`,
      text: `Hello ${reminder.user.name},\n\nThis is a reminder that your event "${reminder.event.name}" is scheduled in ${timeMessage}.\n\nEvent Details:\nDescription: ${reminder.event.description}\nDate: ${eventDate.toLocaleString()}\n\nRegards,\nYour Event Planner App`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${reminder.user.email} for event ${reminder.event.name}`);

    // Mark reminder as notified
    reminder.notified = true;
    await reminder.save();
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};

// Check for pending reminders
const checkReminders = async () => {
  try {
    const currentTime = new Date();
    
    // Find reminders that are due and not yet notified
    const pendingReminders = await Reminder.find({
      reminderTime: { $lte: currentTime },
      notified: false
    });

    console.log(`Found ${pendingReminders.length} pending reminders`);
    
    // Send email for each pending reminder
    for (const reminder of pendingReminders) {
      await sendReminderEmail(reminder);
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

// Initialize the reminder service
const initReminderService = () => {
  // Check for reminders every minute
  cron.schedule('* * * * *', checkReminders);
  console.log('Reminder service initialized');
};

module.exports = {
  initReminderService,
  sendReminderEmail, // Exported for testing
  checkReminders // Exported for testing
};