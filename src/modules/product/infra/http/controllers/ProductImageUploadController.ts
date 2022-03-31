import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadImageProductService } from '@modules/product/services/UploadImageProductService';

class ProductImageUploadController {
  public async upload(request: Request, response: Response): Promise<Response> {
    const { customer_url, id } = request.params;
    const imageFilename = request.file.filename;

    const uploadImageProductService = container.resolve(
      UploadImageProductService,
    );

    const menu = await uploadImageProductService.execute({
      customer_url,
      id: Number(id),
      imageFilename,
    });

    return response.status(200).json(menu);
  }
}

export { ProductImageUploadController };
