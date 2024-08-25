const express = require('express');
const router = express.Router();
const calculateParticleCollisions = require('./collisions.service');

function getCollisions(req, res) {
    const energy = parseFloat(req.query.energy);
    const particles = parseInt(req.query.particles, 10);
  
    if (isNaN(energy) || isNaN(particles)) {
      return res.status(400).json({ error: 'Invalid input. Please provide valid energy and particles parameters.' });
    }
  
    const result = calculateParticleCollisions(energy, particles);
  
    if (result === -1) {
      res.status(400).json({ error: 'Invalid input. Energy and particles must be non-negative.' });
    } else {
      res.json({ energy: energy, particles: particles, collisions: result });
    }
}

router.get('/', getCollisions);

module.exports = router;