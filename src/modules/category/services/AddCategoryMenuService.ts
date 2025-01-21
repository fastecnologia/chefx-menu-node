import { injectable, inject } from 'tsyringe';

import Menu from '../../menu/infra/typeorm/schemas/Menu';

import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';
import ICategoryRepository from '../repositories/ICategoryRepository';

import { ICategoryJSON } from '../dtos/ICategoryDTO';

interface IRequest {
  id: number;
  name: string;
}

@injectable()
class AddCategoryMenuService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoryRepository,
  ) {}

  public async execute(
    customer_url: string,
    { id, name }: IRequest,
  ): Promise<Menu | undefined> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not exists');
    }

    const convertStringToJSON = JSON.stringify(menu.categories);
    const categoriesJSONArray = JSON.parse(convertStringToJSON) as Array<
      ICategoryJSON
    >;

    const newCategory = {
      id,
      name,
    };

    const newCategoryArray = [...categoriesJSONArray, newCategory].sort();

    menu.categories = JSON.parse(JSON.stringify(newCategoryArray));

    await this.categoriesRepository.save(menu);

    return menu;
  }
}

export default AddCategoryMenuService;
