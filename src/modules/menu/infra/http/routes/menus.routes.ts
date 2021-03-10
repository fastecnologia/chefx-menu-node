import { Router } from 'express';

import MenusController from '../controllers/MenusController';

const menusRouter = Router();

const menuController = new MenusController();

menusRouter.get('/:customer_url', menuController.show);
menusRouter.post('/', menuController.create);
menusRouter.put('/:customer_url', menuController.update);
menusRouter.delete('/:customer_url', menuController.delete);

export default menusRouter;
