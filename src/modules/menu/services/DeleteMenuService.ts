import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';
import IMenuRepository from '../repositories/IMenuRepository';

@injectable()
class DeleteMenuService {
    constructor(
        @inject('MenuRepository')
        private menuRepository: IMenuRepository,
    ) {}

    public async execute(customer_url: string): Promise<void> {
        const menu = await this.menuRepository.findMenuByCustomer(customer_url);

        if (!menu) {
            throw new AppError('Menu not exists');
        }

        await this.menuRepository.delete(menu.id);
    }
}

export default DeleteMenuService;
