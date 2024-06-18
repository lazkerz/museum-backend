import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // import fileURLToPath function

dotenv.config();

// Use fileURLToPath to convert import.meta.url to a file path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  serviceName: process.env.SERVICE_NAME,
  pdDatabase: process.env.DATABASE_URL,
  jwtKey: process.env.SECRET, 
  jwtRefresh: process.env.REFRESH_SECRET, 
  sessionKey: process.env.SESSION_SECRET,
  uploadsFolder: path.resolve(__dirname, '..', 'public', 'images'),
};
