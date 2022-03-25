import { Router } from 'express';

import PizzaFlavorController from '../controllers/PizzaFlavorController';

const pizzaFlavorsRouter = Router();
const pizzaFlavorsController = new PizzaFlavorController();

pizzaFlavorsRouter.post('/', pizzaFlavorsController.create);
pizzaFlavorsRouter.put('/:customer_url', pizzaFlavorsController.update);

export default pizzaFlavorsRouter;
