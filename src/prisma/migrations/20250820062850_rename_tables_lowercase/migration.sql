/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rma` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `File`;

-- DropTable
DROP TABLE `Rma`;

-- DropTable
DROP TABLE `Tag`;

-- CreateTable
CREATE TABLE `rma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sn` VARCHAR(191) NOT NULL,
    `rmaNumber` VARCHAR(191) NOT NULL,
    `device` VARCHAR(191) NOT NULL,
    `po` VARCHAR(191) NOT NULL,
    `receivedBy` VARCHAR(191) NOT NULL,
    `issuedDate` DATETIME(3) NOT NULL,
    `receivedDateTime` DATETIME(3) NOT NULL,
    `ready` BOOLEAN NOT NULL,
    `holdingTime` INTEGER NOT NULL,
    `extraInfo` VARCHAR(191) NULL,

    UNIQUE INDEX `rma_sn_key`(`sn`),
    UNIQUE INDEX `rma_rmaNumber_key`(`rmaNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `backgroundColor` VARCHAR(191) NOT NULL,
    `type` ENUM('Product', 'Reseller', 'Company') NOT NULL DEFAULT 'Product',
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `tag_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `URL` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `file_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
