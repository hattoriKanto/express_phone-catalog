import { prisma } from '..';
import { ApiError } from '../exceptions/api.error';
import { NormalizedUser } from '../types/User';

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalize({ id, username }: NormalizedUser) {
  return { id, username };
}

function findByUsername(username: string) {
  return prisma.user.findUnique({ where: { username: username } });
}

function getAllUsers() {
  return prisma.user.findMany();
}

async function register(username: string, password: string, email: string) {
  const existUser = await findByUsername(username);

  if (existUser) {
    throw ApiError.badRequest('User already exists', {
      username: 'User already exists',
    });
  }

  await prisma.user.create({
    data: {
      username,
      password,
      email,
    },
  });
}

export const userService = {
  normalize,
  findByUsername,
  getAllUsers,
  register,
};
