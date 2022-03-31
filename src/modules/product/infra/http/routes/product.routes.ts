import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ProductController from '../controllers/ProductController';
import { ProductImageUploadController } from '../controllers/ProductImageUploadController';

const productRouter = Router();

const productController = new ProductController();
const productImageUploadController = new ProductImageUploadController();

const upload = multer(uploadConfig.multer);

productRouter.post('/:customer_url', productController.create);
productRouter.put('/:customer_url', productController.update);
productRouter.delete('/:customer_url/:id', productController.delete);

productRouter.patch(
  '/image/:customer_url/:id',
  upload.single('image'),
  productImageUploadController.upload,
);

export default productRouter;
