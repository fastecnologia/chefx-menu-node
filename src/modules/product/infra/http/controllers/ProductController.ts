import { Request, Response } from 'express';

export default class ProductController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { customer_url } = request.params;

        return response.json({ customer_url });
    }
}
