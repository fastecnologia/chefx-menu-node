import Menu from '../../menu/infra/typeorm/schemas/Menu';

export default interface IProductRepository {
    update(menu: Menu): Promise<Menu>;
}
