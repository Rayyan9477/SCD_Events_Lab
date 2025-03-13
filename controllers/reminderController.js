const Reminder = require('../models/remainder');
const Event = require('../models/event');
const { validationResult } = require('express-validator');

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private
exports.createReminder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if event exists and belongs to user
    const event = await Event.findById(req.body.event);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Make sure user owns the event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to create reminder for this event'
      });
    }

    // Check if reminder time is before event time
    if (new Date(req.body.reminderTime) > new Date(event.date)) {
      return res.status(400).json({
        success: false,
        error: 'Reminder time must be before event time'
      });
    }

    const reminder = await Reminder.create(req.body);

    res.status(201).json({
      success: true,
      data: reminder
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all reminders for user
// @route   GET /api/reminders
// @access  Private
exports.getReminders = async (req, res) => {
  try {
    const { eventId, notified } = req.query;
    const query = { user: req.user.id };

    // Filter by event if provided
    if (eventId) {
      query.event = eventId;
    }

    // Filter by notification status if provided
    if (notified !== undefined) {
      query.notified = notified === 'true';
    }

    const reminders = await Reminder.find(query)
      .populate({
        path: 'event',
        select: 'name date'
      })
      .sort('reminderTime');

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
exports.getReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id).populate({
      path: 'event',
      select: 'name date'
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    // Make sure user owns the reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this reminder'
      });
    }

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
exports.updateReminder = async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    // Make sure user owns the reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this reminder'
      });
    }

    // If event is being updated, check if it exists and belongs to user
    if (req.body.event) {
      const event = await Event.findById(req.body.event);
      
      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

            // Make sure user owns the event
            if (event.user.toString() !== req.user.id) {
              return res.status(401).json({
                success: false,
                error: 'Not authorized to update reminder for this event'
              });
            }
          }
      
          reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
          });
      
          res.status(200).json({
            success: true,
            data: reminder
          });
        } catch (err) {
          res.status(500).json({
            success: false,
            error: err.message
          });
        }
      };