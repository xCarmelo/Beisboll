import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'


const __filiname = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filiname);

//carga el archivo de .env de forma segura din importar donde se ejecute
dotenv.config({path: path.join(__dirname, '../../.env')});

export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI;