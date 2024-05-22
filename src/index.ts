import express from 'express';
import { PrismaClient } from '@prisma/client';
import { seedDatabase } from './utils/seeding';

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static('public'));

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

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  try {
    if (process.env.TEST_CONNECTION === 'true') {
      await testConnection();
    }

    if (process.env.SEEDING === 'true') {
      await seedDatabase();
    }
  } catch (error) {
    console.error('Error during init:', error);
  }
});
