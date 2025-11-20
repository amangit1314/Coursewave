import { Redis } from "@upstash/redis";
import { features, env } from "./config";

let redis: Redis | null = null;

if (features.cacheEnabled) {
  redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
  });
} else {
  console.warn("[Cache] Disabled: missing Upstash env vars");
}

export default redis;
