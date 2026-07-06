import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      status: 'ok',
      message: 'TourMate API is running',
      routes: ['/api/auth', '/api/ai', '/api/agent', '/api/subjects'],
    };
  }
}
