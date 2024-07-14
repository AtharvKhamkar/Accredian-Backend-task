-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "referee_bonus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referrer_bonus" INTEGER NOT NULL DEFAULT 0;
