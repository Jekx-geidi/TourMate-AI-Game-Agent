import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Standalone, non-destructive: upserts only the one demo account documented
// in the README. Never touches existing users -- unlike seed.ts, no deleteMany.
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Tourmate123!', 10);

  const user = await prisma.user.upsert({
    where: { email: 'student@tourmate.ai' },
    update: {},
    create: {
      name: 'TourMate Student',
      email: 'student@tourmate.ai',
      password,
    },
  });

  console.log('Demo user ready:', { id: user.id, email: user.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
