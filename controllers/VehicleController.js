import Vehicle from '../models/Vehicle.js';

const CLOUDINARY_UPLOAD_PATH = '/image/upload/';
const DELIVERY_OPTIMIZATION = 'f_auto,q_auto:best';

// Keep the stored asset URL unchanged, but deliver Cloudinary images using the
// browser's best supported format and content-aware, high-quality compression.
// No width, height, crop, or DPR transformations are applied.
const getOptimizedImageUrl = (url) => {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;
  if (url.includes(`/${DELIVERY_OPTIMIZATION}/`)) return url;

  return url.replace(
    CLOUDINARY_UPLOAD_PATH,
    `${CLOUDINARY_UPLOAD_PATH}${DELIVERY_OPTIMIZATION}/`
  );
};

const optimizeVehicleImages = (vehicle) => {
  const data = typeof vehicle.toObject === 'function' ? vehicle.toObject() : vehicle;
  return {
    ...data,
    images: Array.isArray(data.images) ? data.images.map(getOptimizedImageUrl) : data.images,
  };
};

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.aggregate([
      {
        $addFields: {
          isSold: {
            $cond: { if: { $eq: ["$status", "Sold"] }, then: 1, else: 0 }
          }
        }
      },
      {
        $sort: { isSold: 1, createdAt: -1 }
      }
    ]);
    res.json(vehicles.map(optimizeVehicleImages));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      res.json(optimizeVehicleImages(vehicle));
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Vehicle not found' });
  }
};

const createVehicle = async (req, res) => {
  try {
    const vehicleData = { ...req.body };
    if (vehicleData.isNewArrival !== false && !vehicleData.newArrivalExpiryDate) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 14);
      vehicleData.newArrivalExpiryDate = expiry;
    }
    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      Object.assign(vehicle, req.body);
      // Auto-set expiry when isNewArrival is turned on and no expiry is set
      if (req.body.isNewArrival === true && !req.body.newArrivalExpiryDate && !vehicle.newArrivalExpiryDate) {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 14);
          vehicle.newArrivalExpiryDate = expiry;
      }
      const updatedVehicle = await vehicle.save();
      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      await vehicle.deleteOne();
      res.json({ message: 'Vehicle removed' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
