import { getMongoRepository, MongoRepository, ObjectID } from 'typeorm';

import IMenuRepository from 'modules/menu/repositories/IMenuRepository';
import ICreateMenuDTO from 'modules/menu/dtos/ICreateMenuDTO';
import Menu from '../schemas/Menu';

class MenuRepository implements IMenuRepository {
  private ormRepository: MongoRepository<Menu>;

  constructor() {
    this.ormRepository = getMongoRepository(Menu, 'mongo');
  }

  public async findMenuByCustomer(
    customer_url: string,
  ): Promise<Menu | undefined> {
    const menu = await this.ormRepository.findOne({
      where: { customer_url },
    });

    return menu;
  }

  public async create({
    customer_name,
    customer_url,
    categories,
    products,
    extra_products,
  }: ICreateMenuDTO): Promise<Menu> {
    const menu = this.ormRepository.create({
      customer_name,
      customer_url,
      categories,
      products,
      extra_products,
    });

    await this.ormRepository.save(menu);

    return menu;
  }

  public async save(menu: Menu): Promise<Menu> {
    return this.ormRepository.save(menu);
  }

  public async delete(id: ObjectID): Promise<void> {
    await this.ormRepository.deleteOne({ _id: id });
  }
}

export default MenuRepository;
