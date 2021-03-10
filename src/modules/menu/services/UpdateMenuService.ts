import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';
import IMenuRepository from '../repositories/IMenuRepository';
import Menu from '../infra/typeorm/schemas/Menu';

interface IRequest {
    customer_name: string;
    customer_url: string;
    categories: string;
    products: string;
    extra_products: string;
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

        menu.customer_name = customer_name;
        menu.categories = categories;
        menu.products = products;
        menu.extra_products = extra_products;

        return this.menuRepository.save(menu);
    }
}

export default UpdateMenuService;
