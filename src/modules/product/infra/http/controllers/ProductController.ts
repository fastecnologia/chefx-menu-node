import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProductservice from '../../../services/UpdateProductService';

export default class ProductController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { customer_url } = request.params;
        const { id, name, price, category_id, description } = request.body;

        const updateProductService = container.resolve(UpdateProductservice);

        const menu = await updateProductService.execute({
            customer_url,
            id,
            name,
            price,
            category_id,
            description,
        });

        return response.json({ menu });
    }
}
