export interface IExtraProduct {
  id: number;
  name: string;
  price: string;
}

export interface IPizzaFlavor {
  id: number;
  name: string;
  price: string;
  description: string;
}

export interface IProductJSON {
  id: number;
  name: string;
  price: string;
  category_id: number;
  description: string;
  is_promotional: boolean;
  promotional_price: string;
  is_pizza: boolean;
  count_flavors: number;
  image: string;
  image_url: string;
  extra_products: Array<IExtraProduct>;
  pizza_flavors: Array<IPizzaFlavor>;
}
