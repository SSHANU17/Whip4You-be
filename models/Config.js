
import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  heroHeadline: { type: String, default: 'DRIVE THE EXTRAORDINARY' },
  promoRate: { type: String, default: '4.99' },
  contactEmail: { type: String, default: 'sales@whip4you.com' },
  contactPhone: { type: String, default: '(555) 012-3456' },
  address: { type: String, default: '123 Luxury Lane, Beverly Hills, CA 90210' }
}, {
  timestamps: true
});

const Config = mongoose.model('Config', configSchema);

export default Config;
