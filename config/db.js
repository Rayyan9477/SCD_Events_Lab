const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if we already have an active connection
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }
  
  try {
    const conn = await mongoose.connect('mongodb+srv://khanzada55455:admin123@cluster0.zmurb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
