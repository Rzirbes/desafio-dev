import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateUserDTO {
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString({ message: 'Senha deve ser um texto.' })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  password!: string;
}
