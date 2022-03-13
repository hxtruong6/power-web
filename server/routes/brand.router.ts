import { Router } from 'express';
import brandController from '../controllers/brand.controller';
import authMiddleware from '../middleware/authentication';

const brandRouter = Router();

brandRouter
	.all('/*', authMiddleware)
	.post('/', brandController.create)
	.put('/', brandController.update)
	.delete('/:id', brandController.remove)
	.get('/', brandController.getAll)
	.get('/:id', brandController.getById);

export default brandRouter;
