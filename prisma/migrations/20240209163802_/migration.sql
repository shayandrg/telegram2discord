/*
  Warnings:

  - You are about to drop the `discordUploadQuee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "discordUploadQuee";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "discordUploadQueue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "isUploading" BOOLEAN NOT NULL DEFAULT false
);
