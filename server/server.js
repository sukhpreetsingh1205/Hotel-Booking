import express from 'express'
import "dotenv/config";
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import authRouter from './routes/authRoutes.js';

connectDB();
connectCloudinary();

const app = express()
app.use(cors())

app.use(express.json())

app.get('/', (req,res)=> res.send("API is Working"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/hotels',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/bookings',bookingRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on : http://localhost:${PORT}`))
