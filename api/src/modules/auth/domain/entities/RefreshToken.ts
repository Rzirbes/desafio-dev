import { Entity } from '../../../../shared/domain/entities/Entity';

type RefreshTokenProps = {
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt?: Date;
};

export class RefreshToken extends Entity<RefreshTokenProps> {
  get token() {
    return this.props.token;
  }

  get userId() {
    return this.props.userId;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get isExpired() {
    return new Date() > this.props.expiresAt;
  }
}
