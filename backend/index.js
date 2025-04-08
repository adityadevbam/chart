const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes (to allow localhost frontend requests)
app.use(cors());

// Load JSON data files once and store in memory
const dataDir = path.join(__dirname, 'data');
const customerTypeData   = JSON.parse(fs.readFileSync(path.join(dataDir, 'Customer Type.json'), 'utf-8'));
const accountIndustryData = JSON.parse(fs.readFileSync(path.join(dataDir, 'Account Industry.json'), 'utf-8'));
const teamData           = JSON.parse(fs.readFileSync(path.join(dataDir, 'Team.json'), 'utf-8'));
const acvRangeData       = JSON.parse(fs.readFileSync(path.join(dataDir, 'ACV Range.json'), 'utf-8'));

// Define RESTful API endpoints for each dataset
app.get('/api/customer-type', (req, res) => {
  res.json(customerTypeData);
});
app.get('/api/account-industry', (req, res) => {
  res.json(accountIndustryData);
});
app.get('/api/team', (req, res) => {
  res.json(teamData);
});
app.get('/api/acv-range', (req, res) => {
  res.json(acvRangeData);
});

// (Optional) A default route to verify the server is running
app.get('/', (req, res) => {
  res.send('ACV Metrics API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is listening on port ${PORT}`);
});
