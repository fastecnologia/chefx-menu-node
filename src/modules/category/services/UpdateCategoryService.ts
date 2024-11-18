import { injectable, inject } from 'tsyringe';

import Menu from '../../menu/infra/typeorm/schemas/Menu';
import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';
import ICategoryRepository from '../repositories/ICategoryRepository';

import IUpdateCategoryDTO from '../dtos/IUpdateCategoryDTO';
import { ICategoryJSON } from '../dtos/ICategoryDTO';

@injectable()
class UpdateCategoryService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoryRepository,
  ) {}

  public async execute({
    customer_url,
    id,
    name,
  }: IUpdateCategoryDTO): Promise<Menu | undefined> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not exists');
    }

    const convertStringToJSON = JSON.stringify(menu.categories);
    const categoriesJSONArray = JSON.parse(convertStringToJSON) as Array<
      ICategoryJSON
    >;

    const categoryProduct = categoriesJSONArray.map(category => {
      if (category.id === id) {
        return {
          ...category,
          name,
        };
      }

      return category;
    });

    menu.categories = JSON.parse(JSON.stringify(categoryProduct));

    await this.categoriesRepository.save(menu);

    return menu;
  }
}

export default UpdateCategoryService;
