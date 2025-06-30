const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await connectDB();

    // Check if a super admin already exists
    const superAdminExists = await User.findOne({ role: 'superadmin' });

    if (superAdminExists) {
      console.log('A Super Admin already exists in the database!');
      process.exit(0);
    }

    // Create the super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@ceycanagro.com',
      password: 'superadmin123',
      role: 'superadmin',
      active: true
    });

    console.log('Super Admin created successfully:');
    console.log('Email: superadmin@ceycanagro.com');
    console.log('Password: superadmin123');
    console.log('\nPlease change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createSuperAdmin();
