import { Injectable } from '@nestjs/common';

export type HelloResponse = {
  response: string;
};

@Injectable()
export class AppService {
  getHello(): HelloResponse {
    return { response: 'Hello World!' };
  }
}
