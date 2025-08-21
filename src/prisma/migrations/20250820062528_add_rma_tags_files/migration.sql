-- CreateTable
CREATE TABLE `Rma` (
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

    UNIQUE INDEX `Rma_sn_key`(`sn`),
    UNIQUE INDEX `Rma_rmaNumber_key`(`rmaNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `backgroundColor` VARCHAR(191) NOT NULL,
    `type` ENUM('Product', 'Reseller', 'Company') NOT NULL DEFAULT 'Product',
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Tag_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `URL` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `File_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
