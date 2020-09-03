import { Router } from 'express';

import menusRouter from '../../../../modules/menu/infra/http/routes/menus.routes';

const routes = Router();

routes.use('/menu', menusRouter);

export default routes;
