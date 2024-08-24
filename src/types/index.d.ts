declare global {
  namespace Express {
    interface Request {
      user?: User;
    }

    interface User {
      isAdmin: boolean;
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DATABASE_NAME: string;
      DATABASE_HOST: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_PORT: number;
      ACCESS_TOKEN_SECRET: string;
    }
  }
}
export {};
