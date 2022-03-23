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

export default interface IUpdateProductDTO {
  customer_url: string;
  id: number;
  name: string;
  price: string;
  category_id: number;
  description: string;
  is_pizza: boolean;
  count_flavors: number;
  extra_products: Array<IExtraProduct>;
  pizza_flavors: Array<IPizzaFlavor>;
}
