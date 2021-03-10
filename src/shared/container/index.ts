import { container } from 'tsyringe';

import IMenuRepository from '../../modules/menu/repositories/IMenuRepository';
import MenuRepository from '../../modules/menu/infra/typeorm/repositories/MenuRepository';

import IProductRepository from '../../modules/product/repositories/IProductRepository';
import ProductRepository from '../../modules/product/infra/typeorm/repositories/ProductRepository';

container.registerSingleton<IMenuRepository>('MenuRepository', MenuRepository);

container.registerSingleton<IProductRepository>(
    'ProductRepository',
    ProductRepository,
);
