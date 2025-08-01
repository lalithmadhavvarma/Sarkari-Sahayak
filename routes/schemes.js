const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// Get all schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single scheme by ID
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new scheme
router.post('/', async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json(scheme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a scheme
router.put('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a scheme
router.delete('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json({ message: 'Scheme deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 