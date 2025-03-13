const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check for existing category with same name for this user
    const existingCategory = await Category.findOne({
      name: req.body.name,
      user: req.user.id
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'You already have a category with this name'
      });
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all categories for user
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Make sure user owns the category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this category'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Make sure user owns the category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this category'
      });
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Make sure user owns the category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this category'
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};