
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  visible: { type: Boolean, default: true },
  source: { type: String, default: 'Google' }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
