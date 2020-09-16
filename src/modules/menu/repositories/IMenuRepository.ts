import { ObjectID } from 'typeorm';

import ICreateMenuDTO from '../dtos/ICreateMenuDTO';
import Menu from '../infra/typeorm/schemas/Menu';

export default interface IMenuRepository {
    findMenuByCustomer(customer_url: string): Promise<Menu | undefined>;
    create(data: ICreateMenuDTO): Promise<Menu>;
    save(menu: Menu): Promise<Menu>;
    delete(id: ObjectID): Promise<void>;
}
