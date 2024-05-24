/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { jwtService } from '../services/jwt.service';
import { ApiError } from '../exceptions/api.error';
import bcrypt from 'bcrypt';
import { tokenService } from '../services/token.service';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '@prisma/client';

function validateEmail(value: string) {
  if (!value) {
    return 'Email is required';
  }

  const emailPattern: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(value)) {
    return 'Email is not valid';
  }
}

function validatePassword(value: string) {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'At least 6 characters';
  }
}

async function register(req: Request, res: Response) {
  const { username, password, email } = req.body;

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email || errors.password) {
    throw ApiError.badRequest('Bad request', errors);
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await userService.register(username, hashedPass, email);

  res.send({ message: 'OK' });
}

async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  const user = await userService.findByUsername(username);

  if (!user) {
    throw ApiError.badRequest('No such user', { errors: 'No such user' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Wrong password', { password: 'Wrong password' });
  }

  await sendAuthentication(res, user);
}

async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.cookies;
  const userData = jwtService.validateRefreshToken(refreshToken);

  const token = await tokenService.getByToken(refreshToken);

  if (!userData || !token) {
    throw ApiError.unauthorized({ jwtToken: 'Jwt Token expired' });
  }

  if (typeof userData !== 'object' || !userData.username) {
    throw ApiError.unauthorized({ jwtToken: 'Invalid JWT token' });
  }

  const user = await userService.findByUsername(userData.username);

  if (!user) {
    throw ApiError.unauthorized({ jwtToken: 'Invalid JWT token' });
  }

  await sendAuthentication(res, user);
}

async function logout(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  const userData = jwtService.validateRefreshToken(refreshToken) as JwtPayload;

  res.clearCookie('refreshToken');

  if (userData) {
    await tokenService.remove(userData.id);
  }

  res.sendStatus(204);
}

async function sendAuthentication(res: Response, user: User) {
  const userData = userService.normalize(user);
  const accessToken = jwtService.generateAccessToken(userData);
  const refreshToken = jwtService.generateRefreshToken(userData);

  await tokenService.save(user.id, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.send({
    user: userData,
    accessToken,
  });
}

async function users(_: Request, res: Response) {
  const allUsers = await userService.getAllUsers();
  const normalizedUsers = allUsers.map(user => userService.normalize(user));

  res.send(normalizedUsers);
}

export const authController = {
  register,
  login,
  users,
  refresh,
  logout,
};
