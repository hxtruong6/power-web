import { Router } from 'express';
import brandController from '../../controllers/brand.controller';

const brandPlRouter = Router();

brandPlRouter.get('/', brandController.getAll);

export default brandPlRouter;
