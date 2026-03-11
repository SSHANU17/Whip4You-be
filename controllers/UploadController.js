
import { v2 as cloudinary } from 'cloudinary';

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
    });

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { uploadImage };
