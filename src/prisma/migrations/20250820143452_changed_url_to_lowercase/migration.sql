/*
  Warnings:

  - You are about to drop the column `URL` on the `file` table. All the data in the column will be lost.
  - Added the required column `url` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file` DROP COLUMN `URL`,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;
