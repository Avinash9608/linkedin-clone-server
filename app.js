const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

const auth = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Enable CORS
app.use(cors({
  origin: ['https://linkedin-clone-client.vercel.app', 'http://localhost:3000'],
  credentials: true
}));

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/posts", posts);

// Root route with environment info for debugging
app.get('/', (req, res) => {
  res.json({
    message: 'LinkedIn Clone API',
    status: 'Running',
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? true : false,
    endpoints: [
      '/api/v1/auth',
      '/api/v1/users',
      '/api/v1/posts'
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ===== Serve static files from React frontend in production =====
// Note: On Vercel, we don't need to serve static files as the frontend is deployed separately
// This code is kept for local development and other deployment environments
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}
// ================================================================

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details for debugging
  console.error('Error details:');
  console.error(`- Message: ${err.message}`);
  console.error(`- Name: ${err.name}`);
  console.error(`- Code: ${err.code}`);
  console.error(`- Stack: ${err.stack}`);

  let error = { ...err };
  error.message = err.message;

  // Mongoose connection errors
  if (err.name === 'MongooseServerSelectionError' || 
      err.name === 'MongooseError' || 
      err.name === 'MongoError') {
    console.error('Database connection error detected');
    return res.status(500).json({
      success: false,
      error: 'Database connection error. Please try again later.',
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Email already in use";
    error = { message, success: false };
    return res.status(400).json({
      success: false,
      error: message,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: message,
    });
  }

  // JWT verification error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token. Please log in again.",
    });
  }

  // JWT expiration error
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired. Please log in again.",
    });
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const errorMessage = error.message || "Server Error";
  
  // Add environment info in development
  const responseData = {
    success: false,
    error: errorMessage,
  };
  
  // Add debug info in development
  if (process.env.NODE_ENV === 'development') {
    responseData.debug = {
      name: err.name,
      code: err.code,
      stack: err.stack,
    };
  }
  
  res.status(statusCode).json(responseData);
});

module.exports = app;
