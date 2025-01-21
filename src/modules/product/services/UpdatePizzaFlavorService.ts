import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import Menu from '../../menu/infra/typeorm/schemas/Menu';

import IMenuRepository from '../../menu/repositories/IMenuRepository';

import IProductRepository from '../repositories/IProductRepository';

import { IProductJSON } from '../dtos/IProductDTO';

// interface IExtraProduct {
//   id: number;
//   name: string;
//   price: string;
// }

// interface IPizzaFlavor {
//   id: number;
//   name: string;
//   price: string;
//   description: string;
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
class UpdatePizzaFlavorService {
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

    const convertStringToJSON = JSON.stringify(menu.products);
    const productJSONArray = JSON.parse(convertStringToJSON) as Array<
      IProductJSON
    >;

    const updateProductPizzaFlavor = productJSONArray.map(product => {
      if (product.id === product_id) {
        const updateFlavor = product.pizza_flavors.map(flavor => {
          if (flavor.id === flavor_id) {
            return {
              ...flavor,
              name,
              price,
              description,
            };
          }

          return flavor;
        });

        return {
          ...product,
          pizza_flavors: updateFlavor,
        };
      }

      return product;
    });

    const updateProductPizzaFlavorsAlphabeticalOrder = updateProductPizzaFlavor.sort(
      (flavor, flavorCompare) => {
        return flavor.name.localeCompare(flavorCompare.name);
      },
    );

    menu.products = JSON.parse(
      JSON.stringify(updateProductPizzaFlavorsAlphabeticalOrder),
    );

    await this.productRepository.save(menu);

    return menu;
  }
}

export default UpdatePizzaFlavorService;
