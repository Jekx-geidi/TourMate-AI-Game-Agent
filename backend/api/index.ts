import { createServer } from 'http';
import { parse } from 'url';

// Track server instance
let server: any = null;

async function bootstrapServer() {
  if (server) return server;
  
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('./src/app.module');
  const { ConfigService } = await import('@nestjs/config');
  const { ValidationPipe } = await import('@nestjs/common');
  const helmet = (await import('helmet')).default;
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  const frontendUrl = configService.get<string>('FRONTEND_URL');
  const allowedOrigins = new Set<string>([
    frontendUrl ?? 'http://localhost:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'https://tourmate-ai-tan.vercel.app',
    'https://tourmate-ai-jekjek110805s-projects.vercel.app',
  ]);

  app.enableCors({
    origin: (origin: string | undefined, callback: Function) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Origin not allowed'), false);
      }
    },
    credentials: true,
  });

  await app.init();
  server = app.getHttpServer();
  return server;
}

export default async function handler(req: any, res: any) {
  const srv = await bootstrapServer();
  srv.emit('request', req, res);
}