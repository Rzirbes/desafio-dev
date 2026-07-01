type CategoryProps = {
  name: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Category {
  public readonly id?: string;
  public name: string;
  public readonly userId: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: CategoryProps, id?: string) {
    this.id = id;
    this.name = props.name;
    this.userId = props.userId;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
