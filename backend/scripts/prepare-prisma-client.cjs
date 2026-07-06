const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const backendRoot = path.resolve(__dirname, '..');
const envPath = path.join(backendRoot, '.env');

function readDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL.trim();
  }

  if (!fs.existsSync(envPath)) {
    return '';
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^\s*DATABASE_URL\s*=\s*("?)(.+?)\1\s*$/m);
  return match ? match[2].trim() : '';
}

const databaseUrl = readDatabaseUrl();
const useLocalSchema = databaseUrl.startsWith('file:');
const schemaPath = path.resolve(
  backendRoot,
  useLocalSchema ? 'prisma/schema.local.prisma' : 'prisma/schema.prisma',
);

console.log(
  `[prisma] Generating client from ${schemaPath} for DATABASE_URL=${databaseUrl || '[not set]'}`,
);

const prismaCliPath = path.join(
  backendRoot,
  'node_modules',
  'prisma',
  'build',
  'index.js',
);

const result = spawnSync(
  process.execPath,
  [prismaCliPath, 'generate', '--schema', schemaPath],
  {
    cwd: backendRoot,
    stdio: 'inherit',
    env: process.env,
    shell: false,
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
