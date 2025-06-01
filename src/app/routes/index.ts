import { Router } from 'express';
import { testRoutes } from '../modules/test.route';


const router = Router();

const moduleRoutes = [
 {
  path:"/test",
  route:testRoutes
 }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
