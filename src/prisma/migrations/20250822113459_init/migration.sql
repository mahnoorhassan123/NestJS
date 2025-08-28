-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `usertype` ENUM('admin', 'user', 'external') NOT NULL,
    `orderExportColumns` VARCHAR(191) NULL,
    `lastPasUpdate` DATETIME(3) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `blockMailSent` BOOLEAN NOT NULL DEFAULT false,
    `token` VARCHAR(191) NULL,
    `googleId` VARCHAR(191) NULL,
    `profilePicture` VARCHAR(191) NULL,
    `googleAcessToken` VARCHAR(191) NULL,
    `CreatedAt` DATETIME(3) NULL,
    `ModifiedBy` INTEGER NULL,
    `CreatedBy` INTEGER NULL,
    `ModifiedAt` DATETIME(3) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `email` VARCHAR(191) NULL,
    `firstname` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `lastModifyOn` DATETIME(3) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `type` ENUM('Store', 'BlueSky') NOT NULL,
    `env` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `password` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `billingAddress1` VARCHAR(191) NOT NULL,
    `billingAddress2` VARCHAR(191) NOT NULL DEFAULT '',
    `city` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `discount` DOUBLE NULL DEFAULT 0.0,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `hide` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `end_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `billingAddress1` VARCHAR(191) NOT NULL,
    `billingAddress2` VARCHAR(191) NOT NULL DEFAULT '',
    `city` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `discount` DOUBLE NULL DEFAULT 0.0,
    `external` BOOLEAN NOT NULL DEFAULT false,
    `hide` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `end_user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `endUserId` INTEGER NOT NULL,
    `havePO` BOOLEAN NOT NULL DEFAULT false,
    `haveBoot` BOOLEAN NOT NULL DEFAULT false,
    `haveCables` BOOLEAN NOT NULL DEFAULT false,
    `haveSimCard` BOOLEAN NOT NULL DEFAULT false,
    `haveSDCard` BOOLEAN NOT NULL DEFAULT false,
    `haveSDcardSize` VARCHAR(191) NULL,
    `haveOther` BOOLEAN NOT NULL DEFAULT false,
    `haveOtherText` VARCHAR(191) NULL,
    `vnet1` VARCHAR(191) NULL,
    `vnet2` VARCHAR(191) NULL,
    `vnet3` VARCHAR(191) NULL,
    `predefinedProblems` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `repairStatus` VARCHAR(191) NOT NULL DEFAULT 'New',
    `unitInfo` VARCHAR(191) NULL,
    `replacedSN` VARCHAR(191) NULL,
    `repairerName` VARCHAR(191) NULL,
    `testedName` VARCHAR(191) NULL,
    `finishedDayTime` DATETIME(3) NULL,
    `shippingTrackingNumber` VARCHAR(191) NULL,
    `bugZilla` VARCHAR(191) NULL,

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
    `typeId` INTEGER NOT NULL DEFAULT 0,
    `color` VARCHAR(191) NOT NULL DEFAULT 'white',
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tag_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `URL` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `file_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activity_log` ADD CONSTRAINT `activity_log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_history` ADD CONSTRAINT `password_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rma` ADD CONSTRAINT `rma_endUserId_fkey` FOREIGN KEY (`endUserId`) REFERENCES `end_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
