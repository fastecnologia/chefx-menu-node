import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import { IStorageProvider } from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';

import IMenuRepository from '../repositories/IMenuRepository';

import { IProductJSON } from '../../product/dtos/IProductDTO';

@injectable()
class DeleteMenuService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(customer_url: string): Promise<void> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not exists');
    }

    const convertStringToJSON = JSON.stringify(menu.products);
    const productJSONArray = JSON.parse(convertStringToJSON) as Array<
      IProductJSON
    >;

    for await (const product of productJSONArray) {
      if (product.image) {
        await this.storageProvider.deleteFile(product.image, customer_url);
      }
    }

    await this.menuRepository.delete(menu.id);
  }
}

export default DeleteMenuService;
