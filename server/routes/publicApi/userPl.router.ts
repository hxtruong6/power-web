import { Router } from 'express';
import userController from '../../controllers/user.controller';
import authMiddleware from '../../middleware/authentication';

const userPlRouter = Router();

userPlRouter.post('/login', userController.login);
userPlRouter.post('/register', userController.register);

userPlRouter.all('/*', authMiddleware).get('/:id', userController.get);

export default userPlRouter;
