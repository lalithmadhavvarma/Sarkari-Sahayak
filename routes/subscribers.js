const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// Subscribe (add new subscriber)
router.post('/', async (req, res) => {
  try {
    const subscriber = new Subscriber(req.body);
    await subscriber.save();
    res.status(201).json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all subscribers (admin only)
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a subscriber
router.delete('/:id', async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
    res.json({ message: 'Subscriber deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 