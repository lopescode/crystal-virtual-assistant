import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('ask-ia')
  async ask(@Body('question') question: string) {
    return this.appService.askIA(question);
  }
}
