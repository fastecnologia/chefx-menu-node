import { Router } from 'express';

import ProductController from '../controllers/ProductController';

const productRouter = Router();

const productController = new ProductController();

productRouter.put('/:customer_url', productController.update);

export default productRouter;
