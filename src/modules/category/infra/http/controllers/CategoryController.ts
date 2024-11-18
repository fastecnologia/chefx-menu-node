import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddCategoryMenuService from '../../../services/AddCategoryMenuService';
import UpdateCategoryService from '../../../services/UpdateCategoryService';
import DeleteCategoryService from '../../../services/DeleteCategoryService';

export default class CategoryController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { customer_url } = request.params;
    const { id, name } = request.body;

    const updateCategoryService = container.resolve(UpdateCategoryService);

    const menu = await updateCategoryService.execute({
      customer_url,
      id,
      name,
    });

    return response.status(200).json(menu);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_url } = request.params;
    const { id, name } = request.body;

    const addCategoryMenuService = container.resolve(AddCategoryMenuService);

    const menu = await addCategoryMenuService.execute(customer_url, {
      id,
      name,
    });

    return response.status(201).json(menu);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { customer_url, id } = request.params;

    const deleteCategoryService = container.resolve(DeleteCategoryService);

    await deleteCategoryService.execute({ customer_url, id: Number(id) });

    return response.status(204).send();
  }
}
