const path = require('path');

// Set NODE_PATH so modules from the backend dir are found
process.env.NODE_PATH = __dirname + '/node_modules';
require('module').Module._initPaths();

// Move CWD to backend root so relative paths work
process.chdir(__dirname);

// Vercel serverless handler - lazy bootstrap NestJS once
let app = null;

async function bootstrap() {
  if (app) return app;
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import(process.cwd() + '/dist/src/app.module');
  const { ConfigService } = await import('@nestjs/config');
  const { ValidationPipe } = await import('@nestjs/common');
  const helmet = (await import('helmet')).default;

  const a = await NestFactory.create(AppModule);
  a.setGlobalPrefix('api');
  a.use(helmet());
  a.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  a.enableCors({
    origin: (origin, callback) => {
      const allowed = new Set([
        frontendUrl,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'https://tourmate-ai-tan.vercel.app',
        'https://tourmate-ai-jekjek110805s-projects.vercel.app',
      ]);
      if (!origin || allowed.has(origin)) callback(null, true);
      else callback(new Error('CORS: origin not allowed'), false);
    },
    credentials: true,
  });

  await a.init();
  app = a.getHttpServer();
  return app;
}

module.exports = async (req, res) => {
  const srv = await bootstrap();
  srv.emit('request', req, res);
};