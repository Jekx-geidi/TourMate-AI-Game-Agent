import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SUBJECT_SEEDS } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  await prisma.chatLog.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.note.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  const demoPassword = await bcrypt.hash('Tourmate123!', 10);

  const demoUser = await prisma.user.create({
    data: {
      name: 'TourMate Student',
      email: 'student@tourmate.ai',
      password: demoPassword,
    },
  });

  const createdSubjects: Array<{ id: string; code: string }> = [];

  for (const subject of SUBJECT_SEEDS) {
    const created = await prisma.subject.create({
      data: {
        code: subject.code,
        title: subject.title,
        description: subject.description,
        icon: subject.icon,
        color: subject.color,
        lessons: {
          create: subject.lessons.map((lesson, index) => ({
            title: lesson.title,
            content: lesson.content,
            summary: lesson.summary,
            order: index + 1,
          })),
        },
        quizzes: {
          create: [
            {
              title: `${subject.code} Mastery Quiz`,
              type: 'multiple_choice',
              questions: {
                create: subject.quizQuestions.map((question) => ({
                  question: question.question,
                  optionA: question.options[0],
                  optionB: question.options[1],
                  optionC: question.options[2],
                  optionD: question.options[3],
                  answer: question.answer,
                  explanation: question.explanation,
                })),
              },
            },
          ],
        },
        flashcards: {
          create: subject.flashcards,
        },
      },
      include: {
        quizzes: true,
      },
    });

    createdSubjects.push({ id: created.id, code: created.code });
  }

  await prisma.note.createMany({
    data: createdSubjects.slice(0, 3).map((subject, index) => ({
      userId: demoUser.id,
      subjectId: subject.id,
      title: `Starter note for ${subject.code}`,
      content:
        index === 0
          ? 'Sustainable tourism protects culture, environment, and community benefit.'
          : index === 1
            ? 'MICE involves meetings, incentives, conferences, and exhibitions with strong planning.'
            : 'Airline management combines safety, passenger care, and smooth operations.',
    })),
  });

  await prisma.progress.createMany({
    data: createdSubjects.map((subject, index) => ({
      userId: demoUser.id,
      subjectId: subject.id,
      category: 'overall',
      percent: Math.min(85, 20 + index * 10),
    })),
  });

  const firstQuiz = await prisma.quiz.findFirst({
    where: { subjectId: createdSubjects[0].id },
  });

  if (firstQuiz) {
    await prisma.quizResult.create({
      data: {
        userId: demoUser.id,
        quizId: firstQuiz.id,
        score: 8,
        total: 10,
      },
    });
  }
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
