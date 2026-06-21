import mongoose from 'mongoose';

const dbCheckMiddleware = (req, res, next) => {
  const state = mongoose.connection.readyState;
  if (state === 0) {
    return res.status(503).json({
      message: "Database is disconnected. Please ensure your MONGODB_URI environment variable is correctly configured on Vercel, and that your MongoDB Atlas cluster whitelists access from anywhere (IP 0.0.0.0/0) to allow Vercel serverless functions to connect.",
    });
  }
  next();
};

export default dbCheckMiddleware;
