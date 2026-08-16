import multer from 'multer';
import path from 'path';
import fs from 'fs';
const dir = process.env.UPLOAD_DIR || 'src/uploads'; fs.mkdirSync(dir, { recursive: true });
const storage = multer.diskStorage({ destination: dir, filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`) });
export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_req, file, cb) => /^(application\/pdf|image\/|video\/)/.test(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF, image, and video files are allowed')) });
