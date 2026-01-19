import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/database';
import routes from './routes';
import corsMiddleware from './middleware/cors';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 8080;

// Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files if needed (e.g., uploads) - though Go code served them via handlers
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.json({ message: 'KmaERM Express API Server is running...' });
});

// Start Server
const startServer = async () => {
  await connectDB();

  // Initialize blockchain service
  try {
    const { blockchainService } = await import('./services/blockchainService');
    await blockchainService.init();
    console.log('✅ Blockchain service initialized');
  } catch (error) {
    console.log('⚠️ Blockchain service not available:', error);
  }

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
};

startServer();
