import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';
import ICategoryRepository from '../repositories/ICategoryRepository';

interface IRequest {
  customer_url: string;
  id: number;
}

interface ICategoryJSON {
  id: number;
}

@injectable()
class DeleteCategoryService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoryRepository,
  ) {}

  public async execute({ customer_url, id }: IRequest): Promise<void> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not exists');
    }

    const convertStringToJSON = JSON.stringify(menu.categories);
    const categoriesJSONArray = JSON.parse(convertStringToJSON) as Array<
      ICategoryJSON
    >;

    const deleteCategoryList = categoriesJSONArray.filter(
      category => category.id !== id,
    );

    menu.categories = JSON.parse(JSON.stringify(deleteCategoryList));

    await this.categoriesRepository.save(menu);
  }
}

export default DeleteCategoryService;
