import { MongoRepository, getMongoRepository } from 'typeorm';

import IProductRepository from 'modules/product/repositories/IProductRepository';
import IUpdateProductDTO from 'modules/product/dtos/IUpdateProductDTO';

import Menu from 'modules/menu/infra/typeorm/schemas/Menu';

class ProductRepository implements IProductRepository {
    private ormRepository: MongoRepository<Menu>;

    constructor() {
        this.ormRepository = getMongoRepository(Menu, 'mongo');
    }

    public async update({
        customer_url,
        id,
        name,
        price,
        category_id,
        description,
    }: IUpdateProductDTO): Promise<void> {
        const menu = this.ormRepository.findOne({ where: { customer_url } });
    }
}

export default ProductRepository;
