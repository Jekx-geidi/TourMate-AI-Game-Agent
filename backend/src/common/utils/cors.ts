export function getAllowedOrigins(env: NodeJS.ProcessEnv = process.env): string[] {
  const defaults = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'https://tourmate-ai-tan.vercel.app',
    'https://tourmate-ai-jekjek110805s-projects.vercel.app',
  ];

  const configuredOrigins = [env.FRONTEND_URL, env.CORS_ORIGINS]
    .flatMap((value) => parseOrigins(value))
    .filter(Boolean);

  return Array.from(new Set([...configuredOrigins, ...defaults]));
}

function parseOrigins(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
