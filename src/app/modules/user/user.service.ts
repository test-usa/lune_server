import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { TUser } from "./user.interface";
import User from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import { createToken } from "../auth/auth.utils";
import config from "../../config";


const registerUserIntoDB = async (payload: TUser) => {
  if(payload.password!==payload.confirmPassword){
    throw new AppError(StatusCodes.BAD_REQUEST,"The password and the confirm password not match!")
  }
  const user = await User.create(payload);
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
    user,
    accessToken,
    refreshToken
  };
};

const getAllUserFromDB = async () => {
  const result = await User.find();
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  return user;
};

const getMyProfileFromDB = async (email: string, role: string) => {
  const user = await User.findOne({ email, role });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  return user;
};

const changeStatusFromDB = async (
  status: 'in-progress' | 'blocked',
  userId: string,
  payload: JwtPayload,
) => {
  const { email } = payload;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (email === user.email) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'User can not change his own status!',
    );
  }
  if (user.status === status) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User status is already ${status}!`,
    );
  }
  const result = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true },
  );
  return result;
};


const deleteUserFromDB = async (userId: string,payload:JwtPayload) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if(isUserExist.email===payload?.email){
    throw new AppError(StatusCodes.BAD_REQUEST, 'User can not delete his own account!',);
  }
  const result = await User.findByIdAndUpdate(userId,{isDeleted:true},{new:true});
  return result;
};


export const userService ={
  getAllUserFromDB,
  registerUserIntoDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  getMyProfileFromDB,
  changeStatusFromDB,
}