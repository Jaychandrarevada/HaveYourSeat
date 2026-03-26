const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  seats: [{ type: String, required: true }],
  totalPrice: { type: Number, required: true },
  ticketId: { type: String, required: true, unique: true },
  theatreName: { type: String, default: 'HaveYourSeat Cinemas' },
  showTime: { type: String, default: '7:30 PM' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
