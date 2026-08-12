import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

/**
 * Validates required production configuration variables before server start.
 * Fails fast with clear error messages if critical settings are missing or insecure.
 */
export function validateProductionConfig() {
  if (process.env.NODE_ENV === 'production') {
    const requiredVars = [
      'JWT_SECRET',
      'DATABASE_URL',
      'CORS_ORIGIN',
      'API_URL',
      'FRONTEND_URL',
    ];
    const missing = requiredVars.filter((v) => !process.env[v] || process.env[v]!.trim() === '');
    if (missing.length > 0) {
      throw new Error(
        `CRITICAL PRODUCTION CONFIG ERROR: Missing required environment variable(s): ${missing.join(', ')}`
      );
    }

    const secret = process.env.JWT_SECRET!;
    const insecureDefaults = [
      'super_secret_netvision_jwt_key',
      'super_secret_netvision_jwt_key_change_in_production',
      'YOUR_PRODUCTION_JWT_SECRET_MIN_32_CHARS_LONG_CHANGE_THIS',
      'change_me',
      'secret',
    ];
    if (
      insecureDefaults.includes(secret) ||
      secret.toLowerCase().includes('change_in_production') ||
      secret.length < 16
    ) {
      throw new Error(
        'CRITICAL SECURITY ERROR: Insecure or default JWT_SECRET detected in production environment!'
      );
    }
  }
}

async function bootstrap() {
  // Validate production configuration before starting app
  validateProductionConfig();

  const app = await NestFactory.create(AppModule);

  // Enable Graceful Shutdown Hooks (Prisma and server resources)
  app.enableShutdownHooks();

  // Trusted Proxy Configuration for Managed Reverse Proxies (Cloudflare, AWS ALB, Nginx, Railway, Render)
  // Ensures ThrottlerGuard and express req.ip read correct client IP from X-Forwarded-For
  const expressApp = app.getHttpAdapter().getInstance();
  const trustedProxySetting = process.env.TRUSTED_PROXY || 'loopback';
  expressApp.set('trust proxy', trustedProxySetting);

  // Security Headers via Helmet
  app.use(helmet());

  // Cookie Parser
  app.use(cookieParser());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Enable CORS for Frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global Prefix
  const apiPrefix = process.env.API_PREFIX || '/api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Swagger OpenAPI Setup (Disabled in Production)
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('NetVision API')
      .setDescription('Interactive Networking Learning Platform Backend API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 NetVision Backend is running on http://localhost:${port}${apiPrefix}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 Swagger Documentation is available at http://localhost:${port}/api/docs`);
  }
}

if (require.main === module) {
  bootstrap();
}
