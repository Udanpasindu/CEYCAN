const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Settings = require('../models/Settings');

// Get contact information - publicly accessible
router.get('/contact', async (req, res) => {
  try {
    const contact = await Settings.findOne({ type: 'contact' });
    if (!contact) {
      return res.json({
        address: "123 Agricultural Avenue, Colombo 07, Sri Lanka",
        phone: "+94 11 234 5678",
        email: "info@ceycanagro.com",
        website: "www.ceycanagro.com",
        description: "CeyCan Agro is a leading agricultural company in Sri Lanka, dedicated to providing the highest quality agricultural products to our customers."
      });
    }
    return res.json(contact.data);
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return res.status(500).json({ error: 'Failed to fetch contact settings' });
  }
});

// Update contact information - any authenticated user can update
router.put('/contact', protect, async (req, res) => {
  try {
    const { address, phone, email, website, description } = req.body;
    
    // Log successful authentication
    console.log('User authenticated for settings update:', req.user);
    
    await Settings.findOneAndUpdate(
      { type: 'contact' },
      { 
        type: 'contact',
        data: { address, phone, email, website, description },
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    return res.json({ success: true, message: 'Contact settings updated' });
  } catch (error) {
    console.error('Error updating contact settings:', error);
    return res.status(500).json({ error: 'Failed to update contact settings', details: error.message });
  }
});

// Get social media links - publicly accessible
router.get('/social', async (req, res) => {
  try {
    const social = await Settings.findOne({ type: 'social' });
    if (!social) {
      return res.json({
        facebook: "https://facebook.com/ceycanagro",
        instagram: "https://instagram.com/ceycanagro",
        twitter: "https://twitter.com/ceycanagro",
        linkedin: "https://linkedin.com/company/ceycanagro"
      });
    }
    return res.json(social.data);
  } catch (error) {
    console.error('Error fetching social media settings:', error);
    return res.status(500).json({ error: 'Failed to fetch social media settings' });
  }
});

// Update social media links - any authenticated user can update
router.put('/social', protect, async (req, res) => {
  try {
    const { facebook, instagram, twitter, linkedin } = req.body;
    
    // Log successful authentication
    console.log('User authenticated for social media update:', req.user);
    
    await Settings.findOneAndUpdate(
      { type: 'social' },
      { 
        type: 'social',
        data: { facebook, instagram, twitter, linkedin },
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    return res.json({ success: true, message: 'Social media settings updated' });
  } catch (error) {
    console.error('Error updating social media settings:', error);
    return res.status(500).json({ error: 'Failed to update social media settings', details: error.message });
  }
});

module.exports = router;
