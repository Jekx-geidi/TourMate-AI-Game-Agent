// Vercel serverless entry point for TourMate AI NestJS backend
import { createServer } from 'http';

// Bootstrap NestJS app once and reuse across invocations
let app: any = null;

async function getApp() {
  if (app) return app;
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('../backend/src/app.module');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'https://tourmate-ai-tan.vercel.app',
      'http://localhost:5173',
      'http://localhost:4000',
    ],
    credentials: true,
  });
  await app.init();
  return app;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  const server = app.getHttpServer();
  // Forward request to NestJS
  server.emit('request', req, res);
}