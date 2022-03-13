import { Router } from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middleware/authentication';

const userRouter = Router();

userRouter.post('/login', userController.login);
userRouter.post('/register', userController.register);

// TODO: create user by admin
// TODO: set role for user by admin

userRouter.all('/*', authMiddleware).get('/:id', userController.get);

export default userRouter;
