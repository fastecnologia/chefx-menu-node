import { Router } from 'express';

import categoryRouter from '../../../../modules/category/infra/http/routes/category.routes';
// import categoryRouter from '@modules/category/infra/http/routes/category.routes';
import menusRouter from '../../../../modules/menu/infra/http/routes/menus.routes';
import productRouter from '../../../../modules/product/infra/http/routes/product.routes';
import pizzaFlavorsRouter from '../../../../modules/product/infra/http/routes/pizza.flavors.routes';

const routes = Router();

routes.use('/menu', menusRouter);
routes.use('/category', categoryRouter);
routes.use('/product', productRouter);
routes.use('/pizza_flavor', pizzaFlavorsRouter);

export default routes;
