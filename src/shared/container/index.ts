import { container } from 'tsyringe';

import IMenuRepository from '../../modules/menu/repositories/IMenuRepository';
import MenuRepository from '../../modules/menu/infra/typeorm/repositories/MenuRepository';

container.registerSingleton<IMenuRepository>('MenuRepository', MenuRepository);
