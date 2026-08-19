/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_createdBy_fkey";

-- DropIndex
DROP INDEX "Task_createdBy_idx";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "createdBy";
