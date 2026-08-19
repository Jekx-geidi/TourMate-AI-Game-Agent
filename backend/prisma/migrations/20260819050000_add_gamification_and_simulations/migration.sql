-- CreateTable
CREATE TABLE "GameProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "lastActiveOn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "xpDelta" INTEGER NOT NULL DEFAULT 0,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "policyVersion" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulation" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "subjectId" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationVersion" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "objectives" JSONB NOT NULL,
    "competencyCodes" JSONB NOT NULL,
    "scoringWeights" JSONB NOT NULL,
    "scorePolicyVersion" TEXT NOT NULL,
    "estimatedStepCount" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationStep" (
    "id" TEXT NOT NULL,
    "simulationVersionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "guidance" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationOption" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "optionKey" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "consequence" TEXT NOT NULL,
    "rubricPoints" JSONB NOT NULL,
    "learningTags" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationLesson" (
    "simulationVersionId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL DEFAULT 'RECOMMENDED',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SimulationLesson_pkey" PRIMARY KEY ("simulationVersionId","lessonId")
);

-- CreateTable
CREATE TABLE "SimulationSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "simulationVersionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "currentStepOrder" INTEGER NOT NULL DEFAULT 0,
    "startRequestKey" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "abandonedAt" TIMESTAMP(3),

    CONSTRAINT "SimulationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationDecision" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "requestKey" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "categoryScores" JSONB NOT NULL,
    "resultBand" TEXT NOT NULL,
    "scorePolicyVersion" TEXT NOT NULL,
    "deterministicFeedback" JSONB NOT NULL,
    "aiFeedback" JSONB,
    "feedbackSource" TEXT NOT NULL DEFAULT 'DETERMINISTIC_FALLBACK',
    "aiProviderId" TEXT,
    "aiModelId" TEXT,
    "aiPromptVersion" TEXT,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "resultSnapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competency" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyEvidence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "evidence" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetencyEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameProfile_userId_key" ON "GameProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityEvent_idempotencyKey_key" ON "ActivityEvent"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ActivityEvent_userId_createdAt_idx" ON "ActivityEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_userId_type_idx" ON "ActivityEvent"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Simulation_slug_key" ON "Simulation"("slug");

-- CreateIndex
CREATE INDEX "Simulation_status_subjectId_idx" ON "Simulation"("status", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationVersion_simulationId_version_key" ON "SimulationVersion"("simulationId", "version");

-- CreateIndex
CREATE INDEX "SimulationVersion_simulationId_publishedAt_idx" ON "SimulationVersion"("simulationId", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationStep_simulationVersionId_orderIndex_key" ON "SimulationStep"("simulationVersionId", "orderIndex");

-- CreateIndex
CREATE INDEX "SimulationStep_simulationVersionId_idx" ON "SimulationStep"("simulationVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationOption_stepId_optionKey_key" ON "SimulationOption"("stepId", "optionKey");

-- CreateIndex
CREATE INDEX "SimulationOption_stepId_idx" ON "SimulationOption"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationSession_startRequestKey_key" ON "SimulationSession"("startRequestKey");

-- CreateIndex
CREATE INDEX "SimulationSession_userId_status_updatedAt_idx" ON "SimulationSession"("userId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "SimulationSession_userId_simulationVersionId_startedAt_idx" ON "SimulationSession"("userId", "simulationVersionId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationDecision_requestKey_key" ON "SimulationDecision"("requestKey");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationDecision_sessionId_stepId_key" ON "SimulationDecision"("sessionId", "stepId");

-- CreateIndex
CREATE INDEX "SimulationDecision_sessionId_submittedAt_idx" ON "SimulationDecision"("sessionId", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationResult_sessionId_key" ON "SimulationResult"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Competency_code_key" ON "Competency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CompetencyEvidence_resultId_competencyId_key" ON "CompetencyEvidence"("resultId", "competencyId");

-- CreateIndex
CREATE INDEX "CompetencyEvidence_userId_competencyId_createdAt_idx" ON "CompetencyEvidence"("userId", "competencyId", "createdAt");

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationVersion" ADD CONSTRAINT "SimulationVersion_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationStep" ADD CONSTRAINT "SimulationStep_simulationVersionId_fkey" FOREIGN KEY ("simulationVersionId") REFERENCES "SimulationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationOption" ADD CONSTRAINT "SimulationOption_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "SimulationStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationLesson" ADD CONSTRAINT "SimulationLesson_simulationVersionId_fkey" FOREIGN KEY ("simulationVersionId") REFERENCES "SimulationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationLesson" ADD CONSTRAINT "SimulationLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationSession" ADD CONSTRAINT "SimulationSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationSession" ADD CONSTRAINT "SimulationSession_simulationVersionId_fkey" FOREIGN KEY ("simulationVersionId") REFERENCES "SimulationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationDecision" ADD CONSTRAINT "SimulationDecision_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SimulationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationDecision" ADD CONSTRAINT "SimulationDecision_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "SimulationStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationDecision" ADD CONSTRAINT "SimulationDecision_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "SimulationOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SimulationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyEvidence" ADD CONSTRAINT "CompetencyEvidence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyEvidence" ADD CONSTRAINT "CompetencyEvidence_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyEvidence" ADD CONSTRAINT "CompetencyEvidence_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "SimulationResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
