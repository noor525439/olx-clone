const http = require('http');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("Database URL Check:", process.env.MONGO_URI);
console.log("Database URL Check:", process.env.MONGO_URI);

const { connectDb } = require('./config/db');
const { createApp } = require('./app');

const PORT = process.env.PORT || 5000 ;

async function start() {
  await connectDb(process.env.MONGO_URI);

  const app = createApp();
  const server = http.createServer(app);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});

