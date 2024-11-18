import { Router } from 'express';

import CategoryController from '../controllers/CategoryController';

const categoryRouter = Router();

const categoryController = new CategoryController();

categoryRouter.post('/:customer_url', categoryController.create);
categoryRouter.put('/:customer_url', categoryController.update);
categoryRouter.delete('/:customer_url/:id', categoryController.delete);

export default categoryRouter;
