import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { seedDelayedFlightMission } from './seed-simulations';

// Standalone entry point for seeding just the mission/gamification content
// (upsert-based, see seed-simulations.ts) against a database that already
// has real data -- unlike seed.ts, this never calls deleteMany() on anything.
const prisma = new PrismaClient();

async function main() {
  const airmgtSubject = await prisma.subject.findUnique({
    where: { code: 'AIRMGT' },
  });

  const relatedLesson = airmgtSubject
    ? await prisma.lesson.findFirst({
        where: {
          subjectId: airmgtSubject.id,
          title: 'Passenger Handling and Ground Services',
        },
      })
    : null;

  await seedDelayedFlightMission(prisma, {
    airmgtSubjectId: airmgtSubject?.id,
    relatedLessonId: relatedLesson?.id,
  });

  console.log('Mission seed complete.', {
    airmgtSubjectId: airmgtSubject?.id ?? null,
    relatedLessonId: relatedLesson?.id ?? null,
  });
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
