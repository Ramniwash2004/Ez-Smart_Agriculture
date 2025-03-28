import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Home page route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Dashboard page route
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

// About page route
router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/about.html'));
});

// Simulation page route
router.get('/simulation', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/simulation.html'));
});

// API route for mock data (for dashboard)
router.get('/api/farm-data', (req, res) => {
  // Generate mock data for the dashboard
  const mockData = {
    moisture: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.random() * 30 + 50
    })),
    temperature: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.random() * 15 + 20
    })),
    irrigation: Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - 6 + i);
      return {
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        value: Math.random() * 20 + 5
      };
    }),
    precipitation: Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - 6 + i);
      return {
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        value: Math.random() * 20
      };
    }),
    crops: [
      { name: 'Corn', value: 35 },
      { name: 'Wheat', value: 25 },
      { name: 'Soybeans', value: 20 },
      { name: 'Alfalfa', value: 15 },
      { name: 'Other', value: 5 }
    ]
  };
  
  res.json(mockData);
});

export default router;