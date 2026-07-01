import type { Request, Response } from 'express';
import { GetProfileUseCase } from 'src/modules/auth/applications/use-cases/GetProfileUseCase';

export class GetProfileController {
  constructor(private getProfileUseCase: GetProfileUseCase) {}

  async handle(request: Request, response: Response) {
    const userId = request.user.id;

    const profile = await this.getProfileUseCase.execute({
      userId,
    });

    return response.status(200).json(profile);
  }
}
