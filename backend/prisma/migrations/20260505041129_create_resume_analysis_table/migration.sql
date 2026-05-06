-- CreateTable
CREATE TABLE "ResumeAnalysis" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "skills" TEXT[],
    "missingSkills" TEXT[],
    "suggestions" TEXT[],
    "jobRoles" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);
