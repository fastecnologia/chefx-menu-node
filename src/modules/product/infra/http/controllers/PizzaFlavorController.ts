import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddPizzaFlavorService from '../../../services/AddPizzaFlavorService';
import UpdatePizzaFlavorService from '../../../services/UpdatePizzaFlavorService';
import DeletePizzaFlavorService from '../../../services/DeletePizzaFlavorService';

class PizzaFlavorController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_url, product_id, flavor_id, name, price } = request.body;

    const addPizzaFlavorService = container.resolve(AddPizzaFlavorService);

    const menu = await addPizzaFlavorService.execute({
      customer_url,
      product_id,
      flavor_id,
      name,
      price,
    });

    return response.status(201).json(menu);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { customer_url } = request.params;
    const { product_id, flavor_id, name, price } = request.body;

    const updatePizzaFlavorService = container.resolve(
      UpdatePizzaFlavorService,
    );

    const menu = await updatePizzaFlavorService.execute({
      customer_url,
      product_id,
      flavor_id,
      name,
      price,
    });

    return response.status(200).json(menu);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { customer_url, product_id, flavor_id } = request.params;

    const deletePizzaFlavorService = container.resolve(
      DeletePizzaFlavorService,
    );

    await deletePizzaFlavorService.execute({
      customer_url,
      product_id: Number(product_id),
      flavor_id: Number(flavor_id),
    });

    return response.status(204).send();
  }
}

export default PizzaFlavorController;
