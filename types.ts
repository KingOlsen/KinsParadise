
export type Category = 'Food' | 'Drink' | 'Dessert';

export type OrderItemStatus = 'Pending' | 'Ready';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  description?: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  status: OrderItemStatus;
}

export type TableStatus = 'Available' | 'Occupied' | 'Billed';

export interface Table {
  id: number;
  number: string;
  status: TableStatus;
  currentOrder?: OrderItem[];
}

export interface RestaurantData {
  name: string;
  address: string;
  phone: string;
}
