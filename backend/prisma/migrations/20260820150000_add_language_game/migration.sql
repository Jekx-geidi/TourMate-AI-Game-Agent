-- CreateTable
CREATE TABLE "VocabWord" (
    "id" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "romanization" TEXT,
    "promptEnglish" TEXT NOT NULL,
    "englishAnswers" JSONB NOT NULL,
    "category" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VocabWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocabWordId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "rawAnswer" TEXT NOT NULL,
    "normalizedAnswer" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "similarity" DOUBLE PRECISION NOT NULL,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "comboAtAnswer" INTEGER NOT NULL DEFAULT 0,
    "requestKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VocabWord_languageCode_category_idx" ON "VocabWord"("languageCode", "category");

-- CreateIndex
CREATE UNIQUE INDEX "VocabWord_languageCode_script_key" ON "VocabWord"("languageCode", "script");

-- CreateIndex
CREATE UNIQUE INDEX "GameAttempt_requestKey_key" ON "GameAttempt"("requestKey");

-- CreateIndex
CREATE INDEX "GameAttempt_userId_vocabWordId_idx" ON "GameAttempt"("userId", "vocabWordId");

-- CreateIndex
CREATE INDEX "GameAttempt_userId_createdAt_idx" ON "GameAttempt"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "GameAttempt" ADD CONSTRAINT "GameAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAttempt" ADD CONSTRAINT "GameAttempt_vocabWordId_fkey" FOREIGN KEY ("vocabWordId") REFERENCES "VocabWord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

