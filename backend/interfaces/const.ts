
export interface GlobalConstants {
  [key: string]: {
    status: number;
    message: string;
  };
}

export interface AppConfig {
  application: {
    env: string;
    port: number;
  };
}
