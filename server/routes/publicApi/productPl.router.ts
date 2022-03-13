import { Router } from 'express';
import productController from '../../controllers/product.controller';

const productPlRouter = Router();

productPlRouter.post('/', productController.getAllPl).get('/:id', productController.getByIdPl);
// .get('/', productController.getByConditions)

export default productPlRouter;
