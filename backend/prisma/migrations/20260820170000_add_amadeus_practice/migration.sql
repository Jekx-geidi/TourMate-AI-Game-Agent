-- CreateTable
CREATE TABLE "AmadeusScenario" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "briefJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AmadeusScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmadeusScenarioStep" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "intent" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instruction" TEXT NOT NULL,
    "requiredTokens" JSONB NOT NULL,
    "hints" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AmadeusScenarioStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmadeusSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "currentStepOrder" INTEGER NOT NULL DEFAULT 0,
    "combo" INTEGER NOT NULL DEFAULT 0,
    "hintCount" INTEGER NOT NULL DEFAULT 0,
    "startRequestKey" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AmadeusSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmadeusAttempt" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "rawCommand" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "comboAtAnswer" INTEGER NOT NULL DEFAULT 0,
    "requestKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AmadeusAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AmadeusScenario_slug_key" ON "AmadeusScenario"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AmadeusScenarioStep_scenarioId_orderIndex_key" ON "AmadeusScenarioStep"("scenarioId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "AmadeusSession_startRequestKey_key" ON "AmadeusSession"("startRequestKey");

-- CreateIndex
CREATE INDEX "AmadeusSession_userId_status_idx" ON "AmadeusSession"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AmadeusAttempt_requestKey_key" ON "AmadeusAttempt"("requestKey");

-- CreateIndex
CREATE INDEX "AmadeusAttempt_sessionId_createdAt_idx" ON "AmadeusAttempt"("sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "AmadeusScenarioStep" ADD CONSTRAINT "AmadeusScenarioStep_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "AmadeusScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmadeusSession" ADD CONSTRAINT "AmadeusSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmadeusSession" ADD CONSTRAINT "AmadeusSession_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "AmadeusScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmadeusAttempt" ADD CONSTRAINT "AmadeusAttempt_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AmadeusSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmadeusAttempt" ADD CONSTRAINT "AmadeusAttempt_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "AmadeusScenarioStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

