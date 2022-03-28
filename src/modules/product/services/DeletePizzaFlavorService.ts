import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';

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

interface IRequest {
  customer_url: string;
  product_id: number;
  flavor_id: number;
}

@injectable()
class DeletePizzaFlavorService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,
  ) {}

  public async execute({
    customer_url,
    product_id,
    flavor_id,
  }: IRequest): Promise<void> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not found!');
    }

    const convertStringToJSON = JSON.stringify(menu.products);
    const productJSONArray = JSON.parse(convertStringToJSON) as Array<
      IProductJSON
    >;

    const productsArray: Array<IProductJSON> = [];
    productJSONArray.forEach(product => {
      if (product.id === product_id) {
        const prod = product;

        const deleteFlavor = prod.pizza_flavors.filter(
          pizza_flavor => pizza_flavor.id !== flavor_id,
        );

        prod.pizza_flavors = deleteFlavor;

        productsArray.push(prod);

        return;
      }

      productsArray.push(product);
    });

    menu.products = JSON.parse(JSON.stringify(productsArray));

    await this.menuRepository.save(menu);
  }
}

export default DeletePizzaFlavorService;
