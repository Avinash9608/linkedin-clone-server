const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI environment variable is not defined');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Don't exit the process immediately in production to allow graceful handling
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw err; // Re-throw to allow handling in server.js
  }
};

module.exports = connectDB;
