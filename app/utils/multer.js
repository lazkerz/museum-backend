import multer from 'multer';
import path from 'path';
import { config } from '../config/index.js';
import fs from 'fs';
import md5 from 'md5';

// Create uploads directory if it doesn't exist
const uploadsDir = config.uploadsFolder;
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const fileName = md5(file.originalname + Date.now());
        const ext = path.extname(file.originalname);
        cb(null, fileName + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)) {
        return cb(new Error('Only image files and mp4 are allowed!'), false);
    }
    cb(null, true);
};

// maxsize 10MB
export const maxSize = 10 * 1024 * 1024;

const uploads = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize }
});

const multipleUploads = uploads.array('media', 10); // 'media' is the name of the form field, limit to 10 files

export default multipleUploads;
