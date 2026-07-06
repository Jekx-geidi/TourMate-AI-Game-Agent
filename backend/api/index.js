/**
 * Vercel serverless entry point for TourMate AI backend.
 * Lazy-bootstrap NestJS once and reuse across invocations.
 */
const path = require('path');
const { Module } = require('module');

// Set up paths so imports from the backend work
process.env.NODE_PATH = __dirname + '/node_modules';
Module._initPaths();
process.chdir(__dirname);

const BACKEND_DIST = path.join(__dirname, 'dist');
const BACKEND_SRC = path.join(BACKEND_DIST, 'src');

let appServer = null;

async function bootstrap() {
  if (appServer) return appServer;

  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import(path.join(BACKEND_SRC, 'app.module'));
  const { ValidationPipe } = await import('@nestjs/common');
  
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  // CORS
  const allowedOrigins = new Set([
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean) : []),
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:5174', 'http://127.0.0.1:5174',
    'https://tourmate-ai-tan.vercel.app',
    'https://tourmate-ai-jekjek110805s-projects.vercel.app',
  ]);
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (
        allowedOrigins.has(origin) ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin.startsWith('https://localhost') ||
        origin.startsWith('https://127.0.0.1')
      ) {
        return cb(null, true);
      }
      return cb(new Error('CORS: not allowed'), false);
    },
    credentials: true,
  });

  // Use helmet manually
  try {
    const helmet = (await import('helmet')).default;
    app.use(helmet());
  } catch {}

  await app.init();
  appServer = app.getHttpServer();
  return appServer;
}

module.exports = async (req, res) => {
  try {
    const srv = await bootstrap();
    srv.emit('request', req, res);
  } catch (err) {
    // If cold start fails, return a meaningful error
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Cold start failed', message: err.message }));
  }
};