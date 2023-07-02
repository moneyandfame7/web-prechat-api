/*
  Warnings:

  - Added the required column `hash` to the `ApiToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiToken" ADD COLUMN     "hash" TEXT NOT NULL;
