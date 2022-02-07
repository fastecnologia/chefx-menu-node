import { injectable, inject } from 'tsyringe';

import Menu from 'modules/menu/infra/typeorm/schemas/Menu';
import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';
import IProductRepository from '../repositories/IProductRepository';

interface IRequestCreateProduct {
  id: number;
  name: string;
  price: string;
  category_id: number;
  description: string;
}

interface IProductJSON {
  id: number;
  name: string;
  price: string;
  category_id: number;
  description: string;
}

@injectable()
class AddProductMenuService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(
    customer_url: string,
    { id, name, price, category_id, description }: IRequestCreateProduct,
  ): Promise<Menu | undefined> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not exists');
    }

    const convertStringToJSON = JSON.stringify(menu.products);
    const productJSONArray = JSON.parse(convertStringToJSON) as Array<
      IProductJSON
    >;

    const newProduct = {
      id,
      name,
      price,
      category_id,
      description,
    };

    const newProductArray = [...productJSONArray, newProduct];

    menu.products = JSON.parse(JSON.stringify(newProductArray));

    await this.productRepository.save(menu);

    return menu;
  }
}

export default AddProductMenuService;
