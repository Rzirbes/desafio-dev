import { randomUUID } from 'node:crypto';

export abstract class Entity<Props> {
  public readonly id: string;

  protected props: Props;

  constructor(props: Props, id?: string) {
    this.id = id ?? randomUUID();
    this.props = props;
  }
}
