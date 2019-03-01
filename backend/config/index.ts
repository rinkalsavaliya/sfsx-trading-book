import { AppConfig } from '../interfaces/const';
import { prodConfig } from './env/production';
import { devConfig } from './env/development';

let appConfig: AppConfig = prodConfig;

if (process.env.NODE_ENV === 'production') {
  appConfig = devConfig;
}

export const config: AppConfig = appConfig;
