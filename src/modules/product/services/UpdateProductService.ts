import { injectable, inject } from 'tsyringe';

import Menu from 'modules/menu/infra/typeorm/schemas/Menu';
import AppError from '../../../shared/errors/AppError';

import IUpdateProductDTO from '../dtos/IUpdateProductDTO';
import IMenuRepository from '../../menu/repositories/IMenuRepository';
import IProductRepository from '../repositories/IProductRepository';

interface IExtraProduct {
  id: number;
  name: string;
  price: string;
}

interface IPizzaFlavor {
  id: number;
  name: string;
  price: string;
}

interface IProductJSON {
  id: number;
  name: string;
  price: string;
  category_id: number;
  description: string;
  is_promotional: boolean;
  promotional_price: string;
  is_pizza: boolean;
  count_flavors: number;
  extra_products: Array<IExtraProduct>;
  pizza_flavors: Array<IPizzaFlavor>;
}

@injectable()
class UpdateProductService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    customer_url,
    id,
    name,
    price,
    category_id,
    description,
    is_promotional,
    promotional_price,
    is_pizza,
    count_flavors,
    extra_products,
    pizza_flavors,
  }: IUpdateProductDTO): Promise<Menu | undefined> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not exists');
    }

    const convertStringToJSON = JSON.stringify(menu.products);
    const productJSONArray = JSON.parse(convertStringToJSON) as Array<
      IProductJSON
    >;

    const updateProduct = productJSONArray.map(product => {
      if (product.id === id) {
        return {
          ...product,
          name,
          price,
          category_id,
          description,
          is_promotional,
          promotional_price,
          is_pizza,
          count_flavors,
          extra_products,
          pizza_flavors,
        };
      }

      return product;
    });

    menu.products = JSON.parse(JSON.stringify(updateProduct));

    this.productRepository.save(menu);

    return menu;
  }
}

export default UpdateProductService;
