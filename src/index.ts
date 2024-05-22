import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { PrismaClient } from '@prisma/client';
import favoriteRouter from './routes/favorites.route';

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World API',
      version: '1.0.0',
      description: 'A simple Express Hello World API',
    },
  },
  // Path to the API docs
  apis: ['./**/*.ts'], // Adjust this later
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.use('/favorites', favoriteRouter);

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Connected successfully to the database');
    const now = await prisma.$queryRaw`SELECT NOW()`;
    console.log('Current time from the database:', now);
  } catch (error) {
    console.error('Failed to connect to the database', error);
  } finally {
    await prisma.$disconnect();
  }
}

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await testConnection();
});
