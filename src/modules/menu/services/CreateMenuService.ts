import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICreateMenuDTO from '../dtos/ICreateMenuDTO';
import Menu from '../infra/typeorm/schemas/Menu';
import IMenuRepository from '../repositories/IMenuRepository';

@injectable()
class CreateMenuService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,
  ) {}

  public async execute({
    customer_name,
    customer_url,
    categories,
    products,
  }: ICreateMenuDTO): Promise<Menu> {
    const menuExists = await this.menuRepository.findMenuByCustomer(
      customer_url,
    );

    if (menuExists) {
      throw new AppError('Menu already exists');
    }

    // const categoriesFormattedJSON = JSON.stringify(categories);
    // const productsFormattedJSON = JSON.stringify(products);
    // const extraProductsFormattedJSON = JSON.stringify(extra_products);

    const menu = await this.menuRepository.create({
      customer_name,
      customer_url,
      categories,
      products,
    });

    return menu;
  }
}

export default CreateMenuService;
