/*
  Warnings:

  - You are about to drop the column `referee_id` on the `Referral` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referral_code]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course_id` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referee_email` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referee_mobile_no` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referee_name` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - The required column `referral_code` was added to the `Referral` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `relation` to the `Referral` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_referee_id_fkey";

-- AlterTable
ALTER TABLE "Referral" DROP COLUMN "referee_id",
ADD COLUMN     "course_id" TEXT NOT NULL,
ADD COLUMN     "referee_email" TEXT NOT NULL,
ADD COLUMN     "referee_mobile_no" TEXT NOT NULL,
ADD COLUMN     "referee_name" TEXT NOT NULL,
ADD COLUMN     "referral_code" TEXT NOT NULL,
ADD COLUMN     "relation" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referral_code_key" ON "Referral"("referral_code");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
