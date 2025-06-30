const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settings');

dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic health check route (available even if DB is down)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Add debug middleware for auth headers
app.use((req, res, next) => {
  if (req.path.includes('/settings/') && req.method === 'PUT') {
    console.log('Auth headers for settings request:', req.headers.authorization ? 
      'Bearer token present' : 'No Bearer token');
  }
  next();
});

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server with database connection
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Give time for logs to be written before exiting
  setTimeout(() => process.exit(1), 100);
});
