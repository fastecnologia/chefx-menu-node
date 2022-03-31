import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IMenuRepository from '../repositories/IMenuRepository';
import Menu from '../infra/typeorm/schemas/Menu';

@injectable()
class ListMenuByCustomerService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,
  ) {}

  public async execute(customer_url: string): Promise<Menu | undefined> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not exists');
    }

    return menu;
  }
}

export default ListMenuByCustomerService;
