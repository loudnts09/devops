const express = require('express');
const packageJson = require('../package.json');
const collisionsRouter = require('./collisions/collision.route');

const app = express();
const port = 3000;

const startTime = new Date().toISOString();

app.get('/', (req, res) => {
  res.json({
    message: 'Server Information',
    startTime: startTime,
    version: packageJson.version
  });
});

app.use('/collisions', collisionsRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});