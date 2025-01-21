import { injectable, inject } from 'tsyringe';

import Menu from '../../menu/infra/typeorm/schemas/Menu';
import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';
import IProductRepository from '../repositories/IProductRepository';

import IUpdateProductDTO from '../dtos/IUpdateProductDTO';
import { IProductJSON } from '../dtos/IProductDTO';

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

    const updateProducts = productJSONArray.map(product => {
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

    const productsAlphabeticalOrder = updateProducts.sort(
      (product, productCompare) => {
        return product.name.localeCompare(productCompare.name);
      },
    );

    menu.products = JSON.parse(JSON.stringify(productsAlphabeticalOrder));

    await this.productRepository.save(menu);

    return menu;
  }
}

export default UpdateProductService;
