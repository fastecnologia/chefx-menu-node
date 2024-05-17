import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateMenuService from '../../../services/CreateMenuService';
import ListMenuByCustomerService from '../../../services/ListMenuByCustomerService';
import UpdateMenuService from '../../../services/UpdateMenuService';
import DeleteMenuService from '../../../services/DeleteMenuService';

export default class MenusController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { customer_url } = request.params;

    const listMenuByCustomer = container.resolve(ListMenuByCustomerService);

    const menu = await listMenuByCustomer.execute(customer_url);

    return response.status(200).json(menu);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customer_name,
      customer_url,
      categories,
      products,
      extra_products,
    } = request.body;

    const menuService = container.resolve(CreateMenuService);

    const menu = await menuService.execute({
      customer_name,
      customer_url,
      categories,
      products,
      extra_products,
    });

    return response.status(201).json(menu);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { customer_url } = request.params;
    const {
      customer_name,
      categories,
      products,
      extra_products,
    } = request.body;

    const updateService = container.resolve(UpdateMenuService);

    const menu = await updateService.execute({
      customer_name,
      customer_url,
      categories,
      products,
      extra_products,
    });

    return response.status(200).json(menu);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { customer_url } = request.params;

    const deleteMenuService = container.resolve(DeleteMenuService);

    await deleteMenuService.execute(customer_url);

    return response.status(204).send();
  }
}
