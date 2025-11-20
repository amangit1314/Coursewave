declare global {
  namespace Express {
    interface Request {
      user?: import("./index").UserPayload;
      skipCache?: boolean;
      cacheKey?: string;
      requestId?: string;
    }
  }
}

export {};