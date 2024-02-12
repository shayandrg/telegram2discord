/*
  Warnings:

  - You are about to drop the `app` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "app";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "App" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "discordUploadQuee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isUploading" BOOLEAN NOT NULL DEFAULT false,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL
);
