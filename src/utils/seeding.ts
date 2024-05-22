import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function seedDatabase() {
  // Paths to the JSON files
  const accessoriesPath = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'api',
    'accessories.json',
  );
  const phonesPath = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'api',
    'phones.json',
  );
  const tabletsPath = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'api',
    'tablets.json',
  );

  const accessories = JSON.parse(fs.readFileSync(accessoriesPath, 'utf-8'));
  const phones = JSON.parse(fs.readFileSync(phonesPath, 'utf-8'));
  const tablets = JSON.parse(fs.readFileSync(tabletsPath, 'utf-8'));

  await prisma.product.createMany({
    data: [...accessories, ...phones, ...tablets],
    skipDuplicates: true,
  });

  console.log('Database has been seeded!');
}

seedDatabase()
  .catch(e => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
