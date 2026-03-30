/*
  Warnings:

  - You are about to drop the column `duration` on the `CleaningTask` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CleaningTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "frequency" TEXT NOT NULL DEFAULT 'WEEKLY',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "CleaningTask_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CleaningTask" ("active", "createdAt", "createdById", "description", "frequency", "id", "name", "priority", "updatedAt") SELECT "active", "createdAt", "createdById", "description", "frequency", "id", "name", "priority", "updatedAt" FROM "CleaningTask";
DROP TABLE "CleaningTask";
ALTER TABLE "new_CleaningTask" RENAME TO "CleaningTask";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
