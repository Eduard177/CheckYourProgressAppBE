import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'dotenv';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };
  constructor() {
    const isDevelopmentEnv =
      typeof process.env.NODE_ENV === 'undefined' ||
      process.env.NODE_ENV === 'development';

    if (isDevelopmentEnv) {
      const envFilePath = `${process.cwd()}/.env`;
      const existPath = fs.existsSync(envFilePath);
      if (!existPath) {
        console.error(`No se pudo encontrar el archivo:${process.cwd()}/.env`);
        process.exit(0);
      }
      this.envConfig = parse(fs.readFileSync(envFilePath));
    } else {
      this.envConfig = {
        PORT: process.env.PORT,
        DATABASE: process.env.DATABASE,
      };
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
