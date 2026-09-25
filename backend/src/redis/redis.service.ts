import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;
  private isRedisConfigured = false;
  public readonly instanceId: string;

  constructor(private readonly configService: ConfigService) {
    this.instanceId = `inst-${process.pid}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
  }

  async onModuleInit() {
    await this.initRedisClient();
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch (err: any) {
        this.client.disconnect();
      }
      this.isConnected = false;
    }
  }

  private async initRedisClient(): Promise<void> {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT') || 6379;
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');
    const enabled = this.configService.get<string>('REDIS_ENABLED', 'true') !== 'false';

    if (!enabled || (!redisUrl && !redisHost)) {
      this.logger.log(`[DistributedState] Redis not configured. Operating in resilient fallback mode (Instance ID: ${this.instanceId}).`);
      this.isRedisConfigured = false;
      this.isConnected = false;
      return;
    }

    this.isRedisConfigured = true;

    try {
      const options: RedisOptions = {
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn(`[DistributedState] Redis unreachable after ${times} retries. Falling back to local storage.`);
            return null; // Stop reconnecting to prevent request starvation
          }
          return Math.min(times * 200, 1000);
        },
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        enableOfflineQueue: false,
      };

      if (redisUrl) {
        this.client = new Redis(redisUrl, options);
      } else {
        this.client = new Redis({
          host: redisHost,
          port: redisPort,
          password: redisPassword || undefined,
          ...options,
        });
      }

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`[DistributedState] Connected to Redis cluster/instance successfully (Instance ID: ${this.instanceId}).`);
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`[DistributedState] Redis connection issue (${err?.message || err}). Safe fallback active.`);
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });

      await this.client.connect().catch((err) => {
        this.isConnected = false;
        this.logger.warn(`[DistributedState] Initial Redis connection deferred (${err?.message || err}). Safe fallback active.`);
      });
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`[DistributedState] Failed to initialize Redis client: ${err?.message || err}. Safe fallback active.`);
    }
  }

  public isAvailable(): boolean {
    return this.isConnected && this.client !== null && this.client.status === 'ready';
  }

  /**
   * Testing hook for multi-instance distributed state simulation
   */
  public setClientForTesting(mockClient: any, instanceId?: string): void {
    this.client = mockClient;
    this.isConnected = Boolean(mockClient);
    this.isRedisConfigured = Boolean(mockClient);
    if (instanceId) {
      (this as any).instanceId = instanceId;
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) return null;
    try {
      const raw = await this.client!.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err: any) {
      this.logger.warn(`[DistributedState] Redis GET error for key ${key}: ${err?.message || err}`);
      return null;
    }
  }

  public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client!.set(key, serialized, 'EX', Math.floor(ttlSeconds));
      } else {
        await this.client!.set(key, serialized);
      }
      return true;
    } catch (err: any) {
      this.logger.warn(`[DistributedState] Redis SET error for key ${key}: ${err?.message || err}`);
      return false;
    }
  }

  public async del(keyOrKeys: string | string[]): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
      if (keys.length === 0) return true;
      await this.client!.del(...keys);
      return true;
    } catch (err: any) {
      this.logger.warn(`[DistributedState] Redis DEL error: ${err?.message || err}`);
      return false;
    }
  }

  public async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      const res = await this.client!.expire(key, Math.floor(ttlSeconds));
      return res === 1;
    } catch (err: any) {
      this.logger.warn(`[DistributedState] Redis EXPIRE error for key ${key}: ${err?.message || err}`);
      return false;
    }
  }

  public async ttl(key: string): Promise<number> {
    if (!this.isAvailable()) return -2;
    try {
      return await this.client!.ttl(key);
    } catch (err: any) {
      return -2;
    }
  }

  public async sadd(key: string, member: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      await this.client!.sadd(key, member);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client!.expire(key, Math.floor(ttlSeconds));
      }
      return true;
    } catch (err: any) {
      this.logger.warn(`[DistributedState] Redis SADD error for key ${key}: ${err?.message || err}`);
      return false;
    }
  }

  public async smembers(key: string): Promise<string[]> {
    if (!this.isAvailable()) return [];
    try {
      return await this.client!.smembers(key);
    } catch (err: any) {
      this.logger.warn(`[DistributedState] Redis SMEMBERS error for key ${key}: ${err?.message || err}`);
      return [];
    }
  }

  public async srem(key: string, member: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      await this.client!.srem(key, member);
      return true;
    } catch (err: any) {
      this.logger.warn(`[DistributedState] Redis SREM error for key ${key}: ${err?.message || err}`);
      return false;
    }
  }

  /**
   * Acquire a distributed lock with automatic TTL expiration to prevent deadlock
   */
  public async acquireLock(lockKey: string, ttlSeconds = 10): Promise<string | null> {
    if (!this.isAvailable()) return `fallback-token-${crypto.randomUUID()}`;
    const token = crypto.randomUUID();
    try {
      const result = await this.client!.set(lockKey, token, 'EX', ttlSeconds, 'NX');
      return result === 'OK' ? token : null;
    } catch (err: any) {
      this.logger.warn(`[DistributedState] Lock acquire error for ${lockKey}: ${err?.message || err}`);
      return null;
    }
  }

  /**
   * Release a distributed lock atomically using Lua script (only delete if token matches)
   */
  public async releaseLock(lockKey: string, token: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    try {
      const result = await this.client!.eval(luaScript, 1, lockKey, token);
      return result === 1;
    } catch (err: any) {
      this.logger.warn(`[DistributedState] Lock release error for ${lockKey}: ${err?.message || err}`);
      return false;
    }
  }

  /**
   * Health Check & Diagnostics Probe
   */
  public async healthCheck(): Promise<{ available: boolean; latencyMs?: number; error?: string }> {
    if (!this.isAvailable()) {
      return {
        available: false,
        error: this.isRedisConfigured ? 'Redis instance is currently unreachable or disconnected.' : 'Redis is not configured in this environment.',
      };
    }
    const start = Date.now();
    try {
      await this.client!.ping();
      const latencyMs = Date.now() - start;
      return { available: true, latencyMs };
    } catch (err: any) {
      return { available: false, error: err?.message || String(err) };
    }
  }
}
