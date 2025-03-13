const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  color: {
    type: String,
    default: '#3498db' // Default blue color
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

// Make sure the user doesn't create duplicate category names
CategorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);