import { Controller, Get } from '@nestjs/common';
import { DemoService } from '../service/demo.service';
import { Usuario } from '../user/usuario.entity';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}
  
  @Get('me')
  async getDemoUser(): Promise<Usuario> {
    return this.demoService.getDemoUser();
  }
}