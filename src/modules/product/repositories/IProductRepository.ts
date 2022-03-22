import Menu from '../../menu/infra/typeorm/schemas/Menu';

export default interface IProductRepository {
  save(menu: Menu): Promise<Menu>;
}
