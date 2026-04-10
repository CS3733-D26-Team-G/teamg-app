import { Auth } from "../middlewares/auth.js";

declare global {
  namespace Express {
    interface Request {
      auth?: Auth;
    }
  }
}

export {};
