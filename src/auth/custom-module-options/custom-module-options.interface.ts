import { JwtModuleOptions } from '@nestjs/jwt';

export interface CustomModuleOptions extends JwtModuleOptions {
  secret: string;
}
