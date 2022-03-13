import { Router } from 'express';
import productController from '../controllers/product.controller';
import authMiddleware from '../middleware/authentication';

const productRouter = Router();

productRouter
	.all('/*', authMiddleware)
	.post('/get', productController.getAll)
	.post('/', productController.insert)
	.put('/', productController.update)
	.delete('/:id', productController.remove)
	.get('/:id', productController.getById)
	.post('/category', productController.attachToCategory)
	.post('/specType', productController.setSpecType);

export default productRouter;
