import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { testService } from './test.service';


export const createTest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await testService.createTestInDB(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'test created successfully',
      data: result,
    });
  },
);



export const testController = {
 createTest 
};
