const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  interests: { type: String, default: 'General' },
  newsletter: { type: Boolean, default: true },
  preferences: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema); 