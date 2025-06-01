import { Router } from 'express';
import validationRequest from '../middlewares/validateRequest';
import { testValidation } from './test.validation';
import { testController } from './test.controller';


const router = Router();

router.post(
  '/create-test',
  validationRequest(testValidation.createTestValidationSchema),
testController.createTest,
);



export const testRoutes = router;
