const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
      heartbeatFrequencyMS: 2000,      // More frequent heartbeats
      family: 4,                        // Force IPv4
      maxPoolSize: 10,                  // Connection pool size
      connectTimeoutMS: 30000,          // Connection timeout
      retryWrites: true,               // Enable retry writes
      retryReads: true,                // Enable retry reads
      w: 'majority'                    // Write concern
    };

    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          console.log(`Connection failed, retrying... (${retries} attempts remaining)`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
      }
    }

    throw lastError;
  } catch (error) {
    console.error('\nMongoDB Connection Error Details:');
    console.error('----------------------------');
    console.error(`Error Type: ${error.name}`);
    console.error(`Error Message: ${error.message}`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\nDNS Resolution Error. Troubleshooting Steps:');
      console.error('1. Check your internet connection');
      console.error('2. Verify the MongoDB connection string format');
      console.error('3. Try using a direct connection string without srv');
      console.error('4. Check if DNS resolution is working properly');
    } else if (error.message.includes('timed out')) {
      console.error('\nConnection Timeout. Troubleshooting Steps:');
      console.error('1. Check if MongoDB server is running');
      console.error('2. Verify network connectivity and firewall settings');
      console.error('3. Check if MongoDB server IP and port are correct');
      console.error('4. Consider increasing connection timeout values');
    }

    throw error;
  }
};

module.exports = connectDB;
