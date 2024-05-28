import 'dotenv/config';
import express from 'express';
import favoriteRouter from './routes/favorites.route';
import productsRouter from './routes/products.route';
import cartRouter from './routes/cart.route';
import * as discountRouter from './routes/discount.route';
import { seedDatabase } from './utils/seeding';
import cors from 'cors';
import { authRouter } from './routes/auth.route';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/users.route';

export const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.use(authRouter);
app.use(userRouter);
app.use('/products', productsRouter);
app.use('/users', favoriteRouter);
app.use('/discount', discountRouter.router);
app.use('/cart', cartRouter);

app.use(errorMiddleware);
app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  try {
    if (process.env.SEEDING === 'true') {
      await seedDatabase();
    }
  } catch (error) {
    console.error('Error during init:', error);
  }
});
