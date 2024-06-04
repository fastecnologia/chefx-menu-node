import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';

import AppError from '../../../shared/errors/AppError';

import { IStorageProvider } from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';

import Menu from '../../menu/infra/typeorm/schemas/Menu';
import IMenuRepository from '../../menu/repositories/IMenuRepository';
import IProductRepository from '../repositories/IProductRepository';

interface IExtraProduct {
  id: number;
  name: string;
  price: string;
}

interface IPizzaFlavor {
  id: number;
  name: string;
  price: string;
}

interface IProductJSON {
  id: number;
  name: string;
  price: string;
  category_id: number;
  description: string;
  is_pizza: boolean;
  count_flavors: number;
  extra_products: Array<IExtraProduct>;
  pizza_flavors: Array<IPizzaFlavor>;
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

    const productFindIndex = productJSONArray.findIndex(prod => prod.id === id);
    const product = productJSONArray[productFindIndex];

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

    const pathImage =
      uploadConfig.driver === 'disk'
        ? process.env.WEB_APP_URL
        : process.env.AWS_BUCKET_URL;

    // product.image = `${customer_url}/${filename}`;
    product.image = `${filename}`;
    product.image_url = `${pathImage}/${menu.customer_url}/${filename}`;

    productJSONArray[productFindIndex] = product;

    menu.products = JSON.parse(JSON.stringify(productJSONArray));

    this.productRepository.save(menu);

    return menu;
  }
}

export { UploadImageProductService };
