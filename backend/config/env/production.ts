import { AppConfig } from '../../interfaces/const';

/**
 * production environment specific constants
 */
export const prodConfig: AppConfig = {
  application: {
    env: 'production',
    port: 3000
  }
};
