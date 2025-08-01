const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? '***' : 'missing' });
    
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token with more user data
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        name: user.name,
        role: 'admin',
        loginTime: new Date().toISOString()
      },
      process.env.JWT_SECRET || 'admin-secret-key-2024',
      { expiresIn: '7d' }
    );
    
    console.log('Token created successfully');
    
    res.json({ 
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify the existing token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret-key-2024');
    
    // Get user data
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Create new token
    const newToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        name: user.name,
        role: 'admin',
        loginTime: new Date().toISOString()
      },
      process.env.JWT_SECRET || 'admin-secret-key-2024',
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Token refreshed successfully',
      token: newToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint to check if admin exists
router.get('/test-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@sarkarisahayak.com' });
    if (admin) {
      res.json({ 
        message: 'Admin exists',
        email: admin.email,
        name: admin.name
      });
    } else {
      res.json({ 
        message: 'Admin does not exist',
        suggestion: 'Create admin user first'
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 