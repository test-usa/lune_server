import { Router } from "express";
import { userController } from "./user.controller";
import validationRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = Router();

router.post('/register',validationRequest(userValidation.registerUserValidationSchema),userController.registerUser);
router.get('/',auth( USER_ROLE.admin),userController.getAllUser);
router.get(
  '/my-profile',
  auth(USER_ROLE.admin,USER_ROLE.user),
  userController.getMyProfile,
);
router.get(
  '/:userId',
  auth(USER_ROLE.admin),
  userController.getSingleUser,
);

router.patch(
  '/change-status',
  auth(USER_ROLE.admin),
  validationRequest(userValidation.updateUserStatusValidationScheme),
  userController.changeStatus,
);

router.delete(
  '/:userId',
  auth(USER_ROLE.admin),
  userController.deleteUser,
);

export const userRoutes = router;