import { Auth } from "../middlewares/auth.ts";

declare global {
  namespace Express {
    interface Request {
      auth?: Auth;
    }
  }
}

export {};
