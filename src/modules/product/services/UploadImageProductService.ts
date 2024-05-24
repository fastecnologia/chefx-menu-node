import { injectable, inject } from 'tsyringe';

import Menu from 'modules/menu/infra/typeorm/schemas/Menu';

import { IStorageProvider } from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '../../../shared/errors/AppError';
import IMenuRepository from '../../menu/repositories/IMenuRepository';
import IProductRepository from '../repositories/IProductRepository';

interface IProductJSON {
  id: number;
  name: string;
  price: string;
  category_id: number;
  description: string;
  image: string;
  image_url: string;
}

interface IRequest {
  customer_url: string;
  id: number;
  imageFilename?: string;
}

@injectable()
class UploadImageProductService {
  constructor(
    @inject('MenuRepository')
    private menuRepository: IMenuRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    customer_url,
    id,
    imageFilename,
  }: IRequest): Promise<Menu | undefined> {
    const menu = await this.menuRepository.findMenuByCustomer(customer_url);

    if (!menu) {
      throw new AppError('Menu not exists');
    }

    const convertStringToJSON = JSON.stringify(menu.products);
    const productJSONArray = JSON.parse(convertStringToJSON) as Array<
      IProductJSON
    >;

    const productFinIndex = productJSONArray.findIndex(prod => prod.id === id);
    const product = productJSONArray[productFinIndex];

    if (product.image) {
      await this.storageProvider.deleteFile(product.image, customer_url);
    }

    let imageFile = '';
    if (imageFilename) {
      imageFile = imageFilename;
    }

    const filename = await this.storageProvider.saveFile(
      imageFile,
      customer_url,
    );

    // product.image = `${customer_url}/${filename}`;
    product.image = `${filename}`;
    product.image_url = `${process.env.AWS_BUCKET_URL}/${filename}`;

    productJSONArray[productFinIndex] = product;

    menu.products = JSON.parse(JSON.stringify(productJSONArray));

    this.productRepository.save(menu);

    return menu;
  }
}

export { UploadImageProductService };
