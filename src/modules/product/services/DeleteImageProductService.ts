import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';
import IProductRepository from '../repositories/IProductRepository';

import { IProductJSON } from '../dtos/IProductDTO';

interface IRequest {
  customer_url: string;
  id: number;
}

@injectable()
class DeleteImageProductService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({ customer_url, id }: IRequest): Promise<void> {
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
          image: null,
          image_url: null,
        };
      }

      return product;
    });

    menu.products = JSON.parse(JSON.stringify(updateProduct));

    await this.productRepository.save(menu);
  }
}

export default DeleteImageProductService;
