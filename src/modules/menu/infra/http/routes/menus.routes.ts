import { Router } from 'express';

import MenusController from '../controllers/MenusController';

const menusRouter = Router();

const menuController = new MenusController();

menusRouter.get('/:customer_url', menuController.show);
menusRouter.post('/', menuController.create);
menusRouter.put('/:customer_url', menuController.update);

export default menusRouter;
