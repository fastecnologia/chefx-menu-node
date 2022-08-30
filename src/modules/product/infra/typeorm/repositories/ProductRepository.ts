import { MongoRepository, getMongoRepository } from 'typeorm';

import Menu from '../../../../menu/infra/typeorm/schemas/Menu';
import IProductRepository from '../../../repositories/IProductRepository';

class ProductRepository implements IProductRepository {
  private ormRepository: MongoRepository<Menu>;

  constructor() {
    this.ormRepository = getMongoRepository(Menu, 'mongo');
  }

  public async save(menu: Menu): Promise<Menu> {
    await this.ormRepository.save(menu);

    return menu;
  }
}

export default ProductRepository;
