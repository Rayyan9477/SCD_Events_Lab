const app = require('./app');
// const reminderService = require('./services/reminderService');

const PORT = process.env.PORT || 5000;

// Start the reminder checking service
// reminderService.initReminderService();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server;