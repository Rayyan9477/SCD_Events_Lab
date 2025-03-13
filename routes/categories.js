const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Create and get all categories
router.route('/')
  .get(categoryController.getCategories)
  .post(
    [
      check('name', 'Name is required').not().isEmpty(),
      check('color', 'Color should be a valid hex color').optional().isHexColor()
    ],
    categoryController.createCategory
  );

// Get, update and delete single category
router.route('/:id')
  .get(categoryController.getCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;