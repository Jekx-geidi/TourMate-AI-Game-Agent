warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7. Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
For more information, see: https://pris.ly/prisma-config

-- CreateTable
CREATE TABLE "UploadedDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "extractedText" TEXT,
    "summary" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UploadedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentQuiz" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentQuizQuestion" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "DocumentQuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentQuizResult" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentQuizResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFlashcardSet" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentFlashcardSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFlashcard" (
    "id" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,

    CONSTRAINT "DocumentFlashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentChatLog" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentChatLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UploadedDocument_userId_createdAt_idx" ON "UploadedDocument"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentQuiz_documentId_key" ON "DocumentQuiz"("documentId");

-- CreateIndex
CREATE INDEX "DocumentQuizQuestion_quizId_idx" ON "DocumentQuizQuestion"("quizId");

-- CreateIndex
CREATE INDEX "DocumentQuizResult_quizId_idx" ON "DocumentQuizResult"("quizId");

-- CreateIndex
CREATE INDEX "DocumentQuizResult_userId_idx" ON "DocumentQuizResult"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentFlashcardSet_documentId_key" ON "DocumentFlashcardSet"("documentId");

-- CreateIndex
CREATE INDEX "DocumentFlashcard_setId_idx" ON "DocumentFlashcard"("setId");

-- CreateIndex
CREATE INDEX "DocumentChatLog_documentId_createdAt_idx" ON "DocumentChatLog"("documentId", "createdAt");

-- AddForeignKey
ALTER TABLE "UploadedDocument" ADD CONSTRAINT "UploadedDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentQuiz" ADD CONSTRAINT "DocumentQuiz_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "UploadedDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentQuizQuestion" ADD CONSTRAINT "DocumentQuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "DocumentQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentQuizResult" ADD CONSTRAINT "DocumentQuizResult_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "DocumentQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentQuizResult" ADD CONSTRAINT "DocumentQuizResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFlashcardSet" ADD CONSTRAINT "DocumentFlashcardSet_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "UploadedDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFlashcard" ADD CONSTRAINT "DocumentFlashcard_setId_fkey" FOREIGN KEY ("setId") REFERENCES "DocumentFlashcardSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChatLog" ADD CONSTRAINT "DocumentChatLog_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "UploadedDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChatLog" ADD CONSTRAINT "DocumentChatLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

