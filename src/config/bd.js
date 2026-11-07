import {MONGODB_URI} from './config.js';
import mongoose from 'mongoose';

export const connectDB = async ()=>{
    try {
        await mongoose.connect(MONGODB_URI);

        console.log('Base de datos conectada');
    } catch (error) {
        console.error(error);
    }
}



