
import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  bodyType: { type: String, required: true },
  transmission: { type: String, required: true },
  fuelType: { type: String, required: true },
  engine: { type: String },
  drivetrain: { type: String },
  exteriorColor: { type: String },
  interiorColor: { type: String },
  vin: { type: String, required: true, unique: true },
  stockNumber: { type: String, required: true, unique: true },
  images: [{ type: String }],
  features: [{ type: String }],
  description: { type: String },
  condition: { type: String, enum: ['New', 'Used', 'Certified'], default: 'Used' },
  status: { type: String, enum: ['Available', 'Pending', 'Sold'], default: 'Available' },
  trim: { type: String }
}, {
  timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
