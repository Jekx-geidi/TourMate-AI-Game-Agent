/**
 * Vercel serverless entry point for the TourMate AI backend.
 *
 * The whole repo deploys as ONE Vercel project:
 *   - the Vite frontend is served as static files at "/"
 *   - every "/api/*" request is rewritten here and handled by NestJS
 *
 * NestJS is bootstrapped once per warm container and reused across
 * invocations. The compiled backend and its dependencies live in
 * ../backend (bundled via `includeFiles` in the root vercel.json).
 */
const path = require('path');
const { Module } = require('module');

const BACKEND_ROOT = path.join(__dirname, '..', 'backend');
const APP_MODULE = path.join(BACKEND_ROOT, 'dist', 'src', 'app.module.js');

// Resolve NestJS / Prisma / etc. from the backend's own node_modules.
process.env.NODE_PATH = path.join(BACKEND_ROOT, 'node_modules');
Module._initPaths();
process.chdir(BACKEND_ROOT);

let cachedServer = null;

async function bootstrap() {
  if (cachedServer) return cachedServer;

  const { NestFactory } = require('@nestjs/core');
  const { ValidationPipe } = require('@nestjs/common');
  const { AppModule } = require(APP_MODULE);

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // Frontend and backend share one origin in production, so CORS is only
  // relevant for local tools / other origins — reflect the caller's origin.
  app.enableCors({ origin: true, credentials: true });

  try {
    const helmet = require('helmet');
    app.use(helmet());
  } catch {
    // helmet is optional; skip if it fails to load
  }

  await app.init();
  cachedServer = app.getHttpServer();
  return cachedServer;
}

module.exports = async (req, res) => {
  try {
    const server = await bootstrap();
    server.emit('request', req, res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'Backend cold start failed',
        message: err && err.message ? err.message : String(err),
      }),
    );
  }
};
