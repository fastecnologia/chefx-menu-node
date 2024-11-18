import Menu from '../../menu/infra/typeorm/schemas/Menu';

export default interface ICategoryRepository {
  save(menu: Menu): Promise<Menu>;
}
