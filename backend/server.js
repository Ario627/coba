import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import profileRoutes from './routes/profileRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT ||  4000;
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });