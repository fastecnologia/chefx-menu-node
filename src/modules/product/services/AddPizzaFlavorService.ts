import { injectable, inject } from 'tsyringe';

import Menu from '../../menu/infra/typeorm/schemas/Menu';

import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';

import IProductRepository from '../repositories/IProductRepository';

import { IPizzaFlavor, IProductJSON } from '../dtos/IProductDTO';

// interface IPizzaFlavor {
//   id: number;
//   name: string;
//   price: string;
//   description: string;
// }

// interface IExtraProduct {
//   id: number;
//   name: string;
//   price: string;
// }

// interface IProductJSON {
//   id: number;
//   name: string;
//   price: string;
//   category_id: number;
//   description: string;
//   is_promotional: boolean;
//   promotional_price: string;
//   is_pizza: boolean;
//   count_flavors: number;
//   image: string;
//   image_url: string;
//   extra_products: Array<IExtraProduct>;
//   pizza_flavors: Array<IPizzaFlavor>;
// }

interface IRequest {
  customer_url: string;
  product_id: number;
  flavor_id: number;
  name: string;
  price: string;
  description: string;
}

@injectable()
class AddPizzaFlavorService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    customer_url,
    product_id,
    flavor_id,
    name,
    price,
    description,
  }: IRequest): Promise<Menu> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not found!', 404);
    }

    const newFlavor = {
      id: flavor_id,
      name,
      price,
      description,
    } as IPizzaFlavor;

    const convertStringToJSON = JSON.stringify(menu.products);
    const productJSONArray = JSON.parse(convertStringToJSON) as Array<
      IProductJSON
    >;

    const addProductPizzaFlavor = productJSONArray.map(product => {
      if (product.id === product_id) {
        if (product.pizza_flavors.some(flavor => flavor.id === flavor_id)) {
          throw new AppError('Flavor already exists!', 400);
        } else {
          return {
            ...product,
            pizza_flavors: [...product.pizza_flavors, newFlavor],
          };
        }
      }

      return product;
    });

    const addProductPizzaFlavorsAlphabeticalOrder = addProductPizzaFlavor.sort(
      (flavor, flavorCompare) => {
        return flavor.name.localeCompare(flavorCompare.name);
      },
    );

    menu.products = JSON.parse(
      JSON.stringify(addProductPizzaFlavorsAlphabeticalOrder),
    );

    await this.productRepository.save(menu);

    return menu;
  }
}

export default AddPizzaFlavorService;
