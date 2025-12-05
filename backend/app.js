const express = require('express');       // Import Express
const cors = require('cors');             // Allow cross-origin requests
const bodyParser = require('body-parser');// Parse incoming JSON data
const employeeRoutes = require('./routes/employeeRoutes'); // Employee routes

const app = express();
app.use(cors());              // Enable CORS for frontend calls
app.use(bodyParser.json());   // Read JSON from request body

// add this if missing:
app.use(express.json());


app.use('/employees', employeeRoutes); // All routes start with /employees

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

module.exports = app;