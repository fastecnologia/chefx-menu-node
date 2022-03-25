import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddProductMenuService from '../../../services/AddProductMenuService';
import UpdateProductService from '../../../services/UpdateProductService';
import DeleteProductService from '../../../services/DeleteProductService';

export default class ProductController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { customer_url } = request.params;
    const {
      id,
      name,
      price,
      category_id,
      description,
      is_promotional,
      promotional_price,
      is_pizza,
      count_flavors,
      extra_products,
      pizza_flavors,
    } = request.body;

    const updateProductService = container.resolve(UpdateProductService);

    const menu = await updateProductService.execute({
      customer_url,
      id,
      name,
      price,
      category_id,
      description,
      is_promotional,
      promotional_price,
      is_pizza,
      count_flavors,
      extra_products,
      pizza_flavors,
    });

    return response.status(200).json(menu);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_url } = request.params;
    const {
      id,
      name,
      price,
      category_id,
      description,
      is_promotional,
      promotional_price,
      is_pizza,
      count_flavors,
      extra_products,
      pizza_flavors,
    } = request.body;

    const addProductMenuService = container.resolve(AddProductMenuService);

    const menu = await addProductMenuService.execute(customer_url, {
      id,
      name,
      price,
      category_id,
      description,
      is_promotional,
      promotional_price,
      is_pizza,
      count_flavors,
      extra_products,
      pizza_flavors,
    });

    return response.status(201).json(menu);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { customer_url, id } = request.params;

    const deleteProductService = container.resolve(DeleteProductService);

    await deleteProductService.execute({ customer_url, id: Number(id) });

    return response.status(204).send();
  }
}
