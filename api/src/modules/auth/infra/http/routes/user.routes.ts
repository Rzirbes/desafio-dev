import { Router } from 'express';
import { PrismaUserRepository } from '../../database/prisma/repositories/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from '../../database/prisma/repositories/PrismaRefreshTokenRepository';
import { GetProfileUseCase } from 'src/modules/auth/applications/use-cases/GetProfileUseCase';
import { GetProfileController } from '../controllers/GetProfileController';
import { LogoutUseCase } from 'src/modules/auth/applications/use-cases/LogoutUseCase';
import { LogoutController } from '../controllers/LogoutController';
import { RegisterUserUseCase } from 'src/modules/auth/applications/use-cases/RegisterUserUseCase';
import { AuthenticateUserUseCase } from 'src/modules/auth/applications/use-cases/AuthenticateUserUseCase';
import { RefreshTokenUseCase } from 'src/modules/auth/applications/use-cases/RefreshTokenUseCase';
import { RegisterUserController } from '../controllers/RegisterUserController';
import { AuthenticateUserController } from '../controllers/AuthenticateUserController';
import { RefreshTokenController } from '../controllers/RefreshTokenController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const userRoutes: Router = Router();

const userRepository = new PrismaUserRepository();
const refreshTokenRepository = new PrismaRefreshTokenRepository();

const getProfileUseCase = new GetProfileUseCase(userRepository);

const getProfileController = new GetProfileController(getProfileUseCase);

const logoutUseCase = new LogoutUseCase(refreshTokenRepository);

const logoutController = new LogoutController(logoutUseCase);

const registerUserUseCase = new RegisterUserUseCase(userRepository);
const authenticateUserUseCase = new AuthenticateUserUseCase(
  userRepository,
  refreshTokenRepository,
);
const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository);

const registerUserController = new RegisterUserController(registerUserUseCase);
const authenticateUserController = new AuthenticateUserController(
  authenticateUserUseCase,
);
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

userRoutes.post('/users', (request, response) => {
  return registerUserController.handle(request, response);
});

userRoutes.post('/sessions', (request, response) => {
  return authenticateUserController.handle(request, response);
});

userRoutes.post('/refresh-token', (request, response) => {
  return refreshTokenController.handle(request, response);
});

userRoutes.get('/me', ensureAuthenticated, (request, response) => {
  return getProfileController.handle(request, response);
});

userRoutes.post('/logout', (request, response) => {
  return logoutController.handle(request, response);
});

export { userRoutes };
