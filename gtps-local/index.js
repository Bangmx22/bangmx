const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8443;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gtps-local' });
});

app.get('/', (req, res) => {
  res.type('text/plain').send('GTPS Local Server Running');
});

app.listen(PORT, () => {
  console.log(`[gtps-local] Server listening on port ${PORT}`);
});
