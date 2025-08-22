/*
  Warnings:

  - You are about to drop the column `fileSize` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `file` table. All the data in the column will be lost.
  - Added the required column `fileExt` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableName` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_userId_fkey`;

-- DropIndex
DROP INDEX `file_userId_fkey` ON `file`;

-- AlterTable
ALTER TABLE `file` DROP COLUMN `fileSize`,
    DROP COLUMN `fileType`,
    DROP COLUMN `userId`,
    ADD COLUMN `fileExt` VARCHAR(191) NOT NULL,
    ADD COLUMN `tableId` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `tableName` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
