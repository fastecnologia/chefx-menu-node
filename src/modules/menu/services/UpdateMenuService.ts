import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../repositories/IMenuRepository';
import Menu from '../infra/typeorm/schemas/Menu';

interface IPizzaFlavor {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface IProduct {
  id: number;
  name: string;
  price: string;
  category_id: number;
  description: string;
  is_promotional: boolean;
  promotional_price: string;
  is_pizza: boolean;
  count_flavors: number;
  image: string;
  image_url: string;
  extra_products: Array<IExtraProduct>;
  pizza_flavors: Array<IPizzaFlavor>;
}

interface IRequest {
  customer_name: string;
  customer_url: string;
  categories: string;
  products: IProduct[];
  extra_products: string;
}

interface IExtraProduct {
  id: number;
  name: string;
  price: string;
}

@injectable()
class UpdateMenuService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,
  ) {}

  public async execute({
    customer_name,
    customer_url,
    categories,
    products,
    extra_products,
  }: IRequest): Promise<Menu> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('This menu not exists');
    }

    const productsUpdate: IProduct[] = [];

    const menuProductExisted = JSON.parse(
      JSON.stringify(menu.products),
    ) as IProduct[];
    // const productParseJSON = JSON.parse(JSON.stringify(products)) as IProduct[];

    products.forEach(product => {
      menuProductExisted.forEach(productExists => {
        if (product.id === productExists.id) {
          const prod = {
            ...productExists,
            id: product.id,
            name: product.name,
            category_id: product.category_id,
            description: product.description,
            is_promotional: product.is_promotional,
            promotional_price: product.promotional_price,
            is_pizza: product.is_pizza,
            count_flavors: product.count_flavors,
          };

          productsUpdate.push(prod);
        }
      });
    });

    menu.customer_name = customer_name;
    menu.categories = categories;
    menu.products = JSON.parse(JSON.stringify(productsUpdate));
    // menu.products = JSON.parse(JSON.stringify(products));
    menu.extra_products = extra_products;

    return this.menuRepository.save(menu);
  }
}

export default UpdateMenuService;
