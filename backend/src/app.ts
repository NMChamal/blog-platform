
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './infrastructure/database';
import { swaggerSpec } from './infrastructure/swagger';
import logger from './infrastructure/logger';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Blog Platform API');
});

app.use(errorHandler);

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`API docs available at http://localhost:${port}/api-docs`);
});

export default server;
