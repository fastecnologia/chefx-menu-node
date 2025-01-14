import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';
import ICategoryRepository from '../repositories/ICategoryRepository';

import { IProductJSON } from '../../product/dtos/IProductDTO';
import { ICategoryJSON } from '../dtos/ICategoryDTO';

interface IRequest {
  customer_url: string;
  id: number;
}

// interface ICategoryJSON {
//   id: number;
// }

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

    const convertCategoryStringToJSON = JSON.stringify(menu.categories);
    const categoriesJSONArray = JSON.parse(
      convertCategoryStringToJSON,
    ) as Array<ICategoryJSON>;

    const convertProductStringToJSON = JSON.stringify(menu.products);
    const productJSONArray = JSON.parse(convertProductStringToJSON) as Array<
      IProductJSON
    >;

    const deleteCategoryList = categoriesJSONArray.filter(
      category => category.id !== id,
    );

    const deleteProductList = productJSONArray.filter(
      product => product.category_id !== id,
    );

    menu.categories = JSON.parse(JSON.stringify(deleteCategoryList));
    menu.products = JSON.parse(JSON.stringify(deleteProductList));

    await this.categoriesRepository.save(menu);
  }
}

export default DeleteCategoryService;
