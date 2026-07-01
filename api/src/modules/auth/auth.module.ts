import { Module } from '@nestjs/common';
import { AuthenticateUserController } from './infra/http/controllers/AuthenticateUserController';
import { RegisterUserController } from './infra/http/controllers/RegisterUserController';
import { RefreshTokenController } from './infra/http/controllers/RefreshTokenController';
import { LogoutController } from './infra/http/controllers/LogoutController';
import { GetProfileController } from './infra/http/controllers/GetProfileController';
import { AuthenticateUserUseCase } from './applications/use-cases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from './applications/use-cases/RegisterUserUseCase';
import { RefreshTokenUseCase } from './applications/use-cases/RefreshTokenUseCase';
import { LogoutUseCase } from './applications/use-cases/LogoutUseCase';
import { GetProfileUseCase } from './applications/use-cases/GetProfileUseCase';
import {
  REFRESH_TOKEN_REPOSITORY,
  USER_REPOSITORY,
} from './domain/repositories/tokens';
import { PrismaUserRepository } from './infra/database/prisma/repositories/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from './infra/database/prisma/repositories/PrismaRefreshTokenRepository';

@Module({
  controllers: [
    AuthenticateUserController,
    RegisterUserController,
    RefreshTokenController,
    LogoutController,
    GetProfileController,
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    GetProfileUseCase,

    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
})
export class AuthModule {}
