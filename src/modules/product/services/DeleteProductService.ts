import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';

import IMenuRepository from '../../menu/repositories/IMenuRepository';
import IProductRepository from '../repositories/IProductRepository';

interface IRequest {
    customer_url: string;
    id: number;
}

interface IProductJSON {
    id: number;
}

@injectable()
class DeleteProductService {
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

        const deleteProductList = productJSONArray.filter(
            product => product.id !== id,
        );

        menu.products = JSON.parse(JSON.stringify(deleteProductList));

        await this.productRepository.save(menu);
    }
}

export default DeleteProductService;
