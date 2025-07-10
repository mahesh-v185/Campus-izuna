
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import models (we will use them later for routes)
const User = require('./models/User');
const Post = require('./models/Post');
const Classroom = require('./models/Classroom');
const Subject = require('./models/Subject');
const Assignment = require('./models/Assignment');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES WILL GO HERE ---

// Example route
app.get('/api', (req, res) => {
  res.send('CampusKizuna API is running!');
});


// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
