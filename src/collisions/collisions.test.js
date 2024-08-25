const calculateParticleCollisions = require('./collisions.service');

test('calculateParticleCollisions with valid inputs', () => {
  const energy = 10000;
  const particles = 200;
  const expected = (energy * Math.pow(particles, 2)) / 1000;
  expect(calculateParticleCollisions(energy, particles)).toBe(expected);
});

test('calculateParticleCollisions with zero energy', () => {
  const energy = 0;
  const particles = 200;
  const expected = 0;
  expect(calculateParticleCollisions(energy, particles)).toBe(expected);
});

test('calculateParticleCollisions with zero particles', () => {
  const energy = 10000;
  const particles = 0;
  const expected = 0;
  expect(calculateParticleCollisions(energy, particles)).toBe(expected);
});

test('calculateParticleCollisions with negative energy', () => {
  const energy = -10000;
  const particles = 200;
  expect(calculateParticleCollisions(energy, particles)).toBe(-1);
});

test('calculateParticleCollisions with negative particles', () => {
  const energy = 10000;
  const particles = -200;
  expect(calculateParticleCollisions(energy, particles)).toBe(-1);
});