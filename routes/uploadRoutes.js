
import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage } from '../controllers/UploadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /^image\/(jpe?g|png|webp)$/i.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! Accepted formats: JPG, PNG, WEBP.'));
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post(
  '/',
  protect,
  admin,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'Image upload failed' });
      }
      next();
    });
  },
  uploadImage
);

export default router;
