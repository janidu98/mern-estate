import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
})

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

//middleware
app.use((err, req, res, next) => {
    const message = err.message || 'Internal Server Error';
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})