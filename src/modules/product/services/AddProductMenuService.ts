import { injectable, inject } from 'tsyringe';

import Menu from 'modules/menu/infra/typeorm/schemas/Menu';
import AppError from '../../../shared/errors/AppError';

import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IMenuRepository from '../../menu/repositories/IMenuRepository';
import IProductRepository from '../repositories/IProductRepository';

interface IProductJSON {
    id: number;
    name: string;
    price: string;
    category_id: number;
    description: string;
}

@injectable()
class AddProductMenuService {
    constructor(
        @inject('MenuRepository')
        private menuRepository: IMenuRepository,
        @inject('ProductRepository')
        private productRepository: IProductRepository,
    ) {}

    public async execute(
        customer_url: string,
        { id, name, price, category_id, description }: ICreateProductDTO,
    ): Promise<Menu | undefined> {
        const menu = await this.menuRepository.findMenuByCustomer(customer_url);

        if (!menu) {
            throw new AppError('Menu not exists');
        }

        const convertStringToJSON = JSON.stringify(menu.products);
        const productJSONArray = JSON.parse(convertStringToJSON) as Array<
            IProductJSON
        >;

        const newProduct = {
            id,
            name,
            price,
            category_id,
            description,
        };

        const newProductArray = [...productJSONArray, newProduct];

        menu.products = JSON.parse(JSON.stringify(newProductArray));

        this.productRepository.save(menu);

        return menu;
    }
}

export default AddProductMenuService;
