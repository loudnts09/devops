
function calculateParticleCollisions(energy, particles) {
    if (energy < 0 || particles < 0) return -1;
    return (energy * Math.pow(particles, 2)) / 1000;
  }
  
module.exports = calculateParticleCollisions;