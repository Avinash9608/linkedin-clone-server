const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");

// Load env vars - only use dotenv in development, not in production/Vercel
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

// Log environment for debugging
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Running on Vercel: ${process.env.VERCEL ? 'Yes' : 'No'}`);

// Connect to database with error handling
try {
  connectDB();
  console.log('Database connection initialized');
} catch (error) {
  console.error('Failed to initialize database connection:', error.message);
}

// For Vercel serverless environment, we don't need to create an HTTP server
// as Vercel will handle that for us
if (process.env.VERCEL) {
  console.log('Running in Vercel serverless environment');
  // Export the Express app directly for Vercel
  module.exports = app;
} else {
  // Traditional server setup for non-Vercel environments
  const server = http.createServer(app);
  const PORT = process.env.PORT || 5000;
  
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
  
  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

// Global error handler for Vercel environment
if (process.env.VERCEL) {
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Unhandled Rejection in Vercel environment: ${err.message}`);
    // In Vercel, we can't close the server, but we can log the error
    console.error(err);
  });
}
