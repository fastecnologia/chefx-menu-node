import IUpdateProductDTO from '../dtos/IUpdateProductDTO';

export default interface IProductRepository {
    update(data: IUpdateProductDTO): Promise<void>;
}
