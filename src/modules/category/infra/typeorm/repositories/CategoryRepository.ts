import { MongoRepository, getMongoRepository } from 'typeorm';

import Menu from '../../../../menu/infra/typeorm/schemas/Menu';
import ICategoryRepository from '../../../repositories/ICategoryRepository';

class CategoryRepository implements ICategoryRepository {
  private ormRepository: MongoRepository<Menu>;

  constructor() {
    this.ormRepository = getMongoRepository(Menu, 'mongo');
  }

  public async save(menu: Menu): Promise<Menu> {
    await this.ormRepository.save(menu);

    return menu;
  }
}

export default CategoryRepository;
