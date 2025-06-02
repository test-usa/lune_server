/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TLogin } from './auth.interface';
import { createToken } from './auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../user/user.model';

const loginUser = async (payload: TLogin) => {
  const user = await User.isUserExistByEmail(payload.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not Exist');
  }
  if (await User.isUserBlog(user.status!)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Blocked!');
  }
  if (!(await User.isPasswordMatch(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Wrong Password!');
  }
  const jwtPayload = {
    email: user.email,
    role: user.role!,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.access_token_expiresIn as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.refresh_token_expiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};


const refreshToken = async (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
  }
  const { email, iat } = decoded;

  const user = await User.isUserExistByEmail(email);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not Exist');
  }
  if (await User.isUserBlog(user.status!)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Blocked!');
  }

  if (
    user.passwordChangedAt &&
    (await User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    ))
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
  }
  const jwtPayload = {
    email: user.email,
    role: user.role!,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.access_token_expiresIn as string,
  );
  return { accessToken };
};



export const authServices = {
  loginUser,
  refreshToken,
};