
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Finance', 'Trade-In', 'General', 'Car Finder']
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'inProgress', 'done'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  remarks: {
    type: String
  },
  details: {
    type: Object
  }
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
