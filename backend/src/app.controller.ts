import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealthStatus() {
    return {
      status: 'ok',
      service: 'NetVision API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
