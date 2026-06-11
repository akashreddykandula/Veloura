import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

export async function uploadImage(req, res) {
  if (!req.file) {
    res.status(400);
    throw new Error('Image file is required');
  }
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataUri = `data:${req.file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: 'veloura' });
  res.status(201).json({ url: result.secure_url, publicId: result.public_id });
}
