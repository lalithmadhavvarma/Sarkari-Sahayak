const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  eligibility: { type: String, required: true },
  benefits: { type: String, required: true },
  status: { type: String, default: 'active' },
  government: { type: String, default: 'Central Government' },
  incomeGroup: { type: String, default: 'All Income Groups' },
  ageGroup: { type: String, default: 'All Age Groups' },
  eligibilityChecklist: [String],
  requiredDocuments: [String],
  applicationProcess: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scheme', SchemeSchema); 