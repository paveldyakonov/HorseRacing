-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "owners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jockeys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "count_of_races" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "jockeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "ownerId" TEXT,
    "jockeyId" TEXT,

    CONSTRAINT "horses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "jockeyId" TEXT NOT NULL,
    "horseId" TEXT NOT NULL,
    "place" INTEGER NOT NULL,
    "time_result" INTEGER NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitions" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "datetime" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetitionToHorse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompetitionToJockey" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "horses_jockeyId_key" ON "horses"("jockeyId");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToHorse_AB_unique" ON "_CompetitionToHorse"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToHorse_B_index" ON "_CompetitionToHorse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToJockey_AB_unique" ON "_CompetitionToJockey"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToJockey_B_index" ON "_CompetitionToJockey"("B");

-- AddForeignKey
ALTER TABLE "horses" ADD CONSTRAINT "horses_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horses" ADD CONSTRAINT "horses_jockeyId_fkey" FOREIGN KEY ("jockeyId") REFERENCES "jockeys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_jockeyId_fkey" FOREIGN KEY ("jockeyId") REFERENCES "jockeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "horses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToHorse" ADD CONSTRAINT "_CompetitionToHorse_A_fkey" FOREIGN KEY ("A") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToHorse" ADD CONSTRAINT "_CompetitionToHorse_B_fkey" FOREIGN KEY ("B") REFERENCES "horses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToJockey" ADD CONSTRAINT "_CompetitionToJockey_A_fkey" FOREIGN KEY ("A") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToJockey" ADD CONSTRAINT "_CompetitionToJockey_B_fkey" FOREIGN KEY ("B") REFERENCES "jockeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
