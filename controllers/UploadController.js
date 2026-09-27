
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary applies this incoming transformation before storing the asset, so
// the returned URL already points to the optimized image rather than the raw
// upload. No resize is applied: the uploaded dimensions are preserved exactly.
const UPLOAD_IMAGE_TRANSFORMATION = [
  {
    // Content-aware compression at Cloudinary's highest automatic quality tier.
    // This is intended to be visually indistinguishable while reducing file size.
    quality: 'auto:best',
  },
];

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'Cloudinary is not configured on server' });
    }

    const fileBuffer = req.file.buffer;
    if (!fileBuffer) {
      return res.status(400).json({ message: 'Uploaded file payload is invalid' });
    }

    const dataUri = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'whip4you',
      resource_type: 'image',
      transformation: UPLOAD_IMAGE_TRANSFORMATION,
    });

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { uploadImage };
