-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client" TEXT NOT NULL,
    "preparedBy" TEXT NOT NULL DEFAULT 'Biel Rivero',
    "companyName" TEXT NOT NULL DEFAULT 'Servicios de Ingeniería y Desarrollo',
    "companyAddress" TEXT NOT NULL DEFAULT 'Palma de Mallorca',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Quote" ("client", "createdAt", "date", "id", "notes", "preparedBy", "total", "updatedAt") SELECT "client", "createdAt", "date", "id", "notes", "preparedBy", "total", "updatedAt" FROM "Quote";
DROP TABLE "Quote";
ALTER TABLE "new_Quote" RENAME TO "Quote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
