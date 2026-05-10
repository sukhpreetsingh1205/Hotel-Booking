import express from 'express'
import {  checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability' , checkAvailabilityAPI);
// Backward-compatible typo route (can be removed later)
bookingRouter.post('/check-availaiblity' , checkAvailabilityAPI);
bookingRouter.post('/book',protect, createBooking);
bookingRouter.get('/user',protect,getUserBookings);
bookingRouter.get('/hotel',protect,getHotelBookings);

export default bookingRouter;
