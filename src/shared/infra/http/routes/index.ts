import { Router } from 'express';

import menusRouter from '../../../../modules/menu/infra/http/routes/menus.routes';
import productRouter from '../../../../modules/product/infra/http/routes/product.routes';
import pizzaFlavorsRouter from '../../../../modules/product/infra/http/routes/pizza.flavors.routes';

const routes = Router();

routes.use('/menu', menusRouter);
routes.use('/product', productRouter);
routes.use('/pizza_flavor', pizzaFlavorsRouter);

export default routes;
