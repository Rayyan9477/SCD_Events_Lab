const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Create and get all events
router.route('/')
  .get(eventController.getEvents)
  .post(
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('date', 'Date is required and must be valid').isISO8601().toDate(),
      check('category', 'Category is required').isMongoId()
    ],
    eventController.createEvent
  );

// Get, update and delete single event
router.route('/:id')
  .get(eventController.getEvent)
  .put(eventController.updateEvent)
  .delete(eventController.deleteEvent);

module.exports = router;