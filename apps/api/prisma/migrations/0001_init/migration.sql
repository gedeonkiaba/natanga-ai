-- Migration initiale Natanga — schéma complet (auth + consentement + pédagogie).
-- Correspond au `schema.prisma` v2. Générée à la main pour la traçabilité
-- (le `prisma migrate diff` étant bloqué par le sandbox en session).
-- À appliquer via `prisma migrate deploy` ou `prisma db push`.

-- ─── Auth & consentement ────────────────────────────────────────────────────────

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'parent',
    "status" TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "avatar" TEXT,
    "ageBand" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "audit" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailToken" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EmailToken_pkey" PRIMARY KEY ("token")
);

-- ─── Pédagogie ─────────────────────────────────────────────────────────────────

CREATE TABLE "SkillNode" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "unlockedWhen" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SkillNode_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "params" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "phoneme" TEXT,
    "audioUrl" TEXT,
    "metadata" JSONB,
    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "masteredScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "itemId" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "errorKind" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- ─── Index ──────────────────────────────────────────────────────────────────────

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Child_userId_idx" ON "Child"("userId");
CREATE INDEX "Consent_childId_idx" ON "Consent"("childId");
CREATE UNIQUE INDEX "Consent_childId_version_key" ON "Consent"("childId", "version");
CREATE INDEX "EmailToken_userId_idx" ON "EmailToken"("userId");

CREATE INDEX "SkillNode_level_idx" ON "SkillNode"("level");
CREATE INDEX "Lesson_nodeId_idx" ON "Lesson"("nodeId");
CREATE INDEX "Exercise_lessonId_idx" ON "Exercise"("lessonId");
CREATE INDEX "Item_type_idx" ON "Item"("type");
CREATE UNIQUE INDEX "Progress_childId_nodeId_key" ON "Progress"("childId", "nodeId");
CREATE INDEX "Progress_nodeId_idx" ON "Progress"("nodeId");
CREATE INDEX "Attempt_childId_idx" ON "Attempt"("childId");
CREATE INDEX "Attempt_exerciseId_idx" ON "Attempt"("exerciseId");
CREATE INDEX "Reward_childId_idx" ON "Reward"("childId");

-- ─── Clés étrangères (cascade pour l'effacement RGPD) ───────────────────────────

ALTER TABLE "Child"
    ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Consent"
    ADD CONSTRAINT "Consent_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Lesson"
    ADD CONSTRAINT "Lesson_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "SkillNode"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Exercise"
    ADD CONSTRAINT "Exercise_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Progress"
    ADD CONSTRAINT "Progress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Progress"
    ADD CONSTRAINT "Progress_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "SkillNode"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Attempt"
    ADD CONSTRAINT "Attempt_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Attempt"
    ADD CONSTRAINT "Attempt_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reward"
    ADD CONSTRAINT "Reward_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
