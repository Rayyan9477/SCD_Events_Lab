const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  reminderTime: {
    type: Date,
    required: [true, 'Please add a reminder time']
  },
  notified: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for querying reminders by time and notification status
ReminderSchema.index({ reminderTime: 1, notified: 1 });

module.exports = mongoose.model('Reminder', ReminderSchema);