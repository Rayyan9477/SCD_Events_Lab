const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const reminderController = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Create and get all reminders
router.route('/')
  .get(reminderController.getReminders)
  .post(
    [
      check('event', 'Event is required').isMongoId(),
      check('reminderTime', 'Reminder time is required and must be valid').isISO8601().toDate()
    ],
    reminderController.createReminder
  );

// Get, update and delete single reminder
router.route('/:id')
  .get(reminderController.getReminder)
  .put(reminderController.updateReminder)
  .delete(reminderController.deleteReminder);

module.exports = router;