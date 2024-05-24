import { prisma } from '..';

async function save(userId: number, newToken: string) {
  const token = await prisma.token.findUnique({ where: { userId } });

  if (!token) {
    return await prisma.token.create({
      data: {
        userId,
        refreshToken: newToken,
      },
    });
  } else {
    await prisma.token.update({
      where: {
        userId,
      },
      data: {
        refreshToken: newToken,
      },
    });
  }
}

async function getByToken(refreshToken: string) {
  return prisma.token.findFirst({ where: { refreshToken } });
}

async function remove(userId: number) {
  return prisma.token.delete({ where: { userId } });
}

export const tokenService = {
  save,
  getByToken,
  remove,
};
