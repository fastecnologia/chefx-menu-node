import { Router } from 'express';

import ProductController from '../controllers/ProductController';

const productRouter = Router();

const productController = new ProductController();

productRouter.post('/:customer_url', productController.create);
productRouter.put('/:customer_url', productController.update);
productRouter.delete('/:customer_url/:id', productController.delete);

export default productRouter;
