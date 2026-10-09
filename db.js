require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // process.env.MONGO_URI se variable read karega
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); 
    }
  
};
  module.exports = connectDB;