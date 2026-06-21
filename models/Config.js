
import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  heroHeadline: { type: String, default: 'DRIVE THE EXTRAORDINARY' },
  promoRate: { type: String, default: '4.99' },
  contactEmail: { type: String, default: 'Whip4youauto@gmail.com' },
  contactPhone: { type: String, default: '(604) 712-1994' },
  address: { type: String, default: '102-20771 Langley Bypass, Langley, BC V3A 5E8' },
  inventoryGridSize: { type: Number, default: 12 }
}, {
  timestamps: true
});

const Config = mongoose.model('Config', configSchema);

export default Config;
