import { Request, Response } from 'express';

import { container } from 'tsyringe';

import DeleteImageProductService from '../../../services/DeleteImageProductService';

export default class DeleteImageProductController {
  public async delete(request: Request, response: Response): Promise<Response> {
    const { customer_url, id } = request.params;

    const deleteImageProductService = container.resolve(
      DeleteImageProductService,
    );

    await deleteImageProductService.execute({ customer_url, id: Number(id) });

    return response.status(204).send();
  }
}
