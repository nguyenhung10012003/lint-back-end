/*
  Warnings:

  - You are about to drop the column `isPrivate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `isPrivate`;

-- CreateTable
CREATE TABLE `Setting` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `theme` ENUM('DEFAULT', 'LIGHT', 'DARK') NOT NULL DEFAULT 'DEFAULT',
    `lang` ENUM('VI', 'EN') NOT NULL DEFAULT 'VI',
    `status` ENUM('PUBLIC', 'PRIVATE') NOT NULL DEFAULT 'PUBLIC',

    UNIQUE INDEX `Setting_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Setting` ADD CONSTRAINT `Setting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
