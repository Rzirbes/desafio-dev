import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/category/categories.module';
import { TransactionsModule } from './modules/transaction/transaction.module';

@Module({
  imports: [AuthModule, CategoriesModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
