import {
  ObjectID,
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('menus')
class Menu {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  customer_name: string;

  @Column()
  customer_url: string;

  @Column()
  categories: string;

  @Column()
  products: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Menu;
