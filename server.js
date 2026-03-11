require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express(); // Add this back! It creates the express app.
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve HTML files

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Cloud Connected Successfully!'))
  .catch(err => console.log('❌ DB Error:', err.message)); // Only need one catch!

// --- Schemas ---
const FlightSchema = new mongoose.Schema({
  from: String, to: String, date: String, airline: String,
  flightNo: String, depTime: String, arrTime: String, price: Number
});
const Flight = mongoose.model('Flight', FlightSchema);

const BookingSchema = new mongoose.Schema({
  passengerName: String,
  phone: String,
  flightId: String,
  route: String,
  date: String,
  seats: [String],
  totalPaid: Number,
  bookingDate: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', BookingSchema);

// --- Routes ---

// 1. Serve Website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Search Flights
app.get('/api/flights', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const flights = await Flight.find({
      from: { $regex: new RegExp(`^${from}$`, 'i') },
      to: { $regex: new RegExp(`^${to}$`, 'i') },
      date: date
    });
    res.json(flights);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Create Booking
app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    console.log("💰 New Booking:", newBooking); // Logs details to Terminal
    res.json({ message: 'Success', id: newBooking._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. (NEW) View All Bookings
app.get('/api/all-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Seed Data
const seedFlights = async () => {
  try {
    const count = await Flight.countDocuments();
    if (count === 0) {
      await Flight.insertMany([
        { from: 'Mumbai', to: 'Delhi', date: '2025-10-25', airline: 'IndiGo', flightNo: '6E-402', depTime: '10:00', arrTime: '12:00', price: 4500 },
        { from: 'Mumbai', to: 'Delhi', date: '2025-10-25', airline: 'Air India', flightNo: 'AI-887', depTime: '14:00', arrTime: '16:30', price: 5200 },
        { from: 'Bengaluru', to: 'Goa', date: '2025-11-01', airline: 'Vistara', flightNo: 'UK-901', depTime: '09:00', arrTime: '10:15', price: 3800 }
      ]);
      console.log("✈️ Dummy flights added");
    }
  } catch (err) {}
};
seedFlights();

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));