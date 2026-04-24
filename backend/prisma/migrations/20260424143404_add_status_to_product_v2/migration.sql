-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "richDescription" TEXT,
    "sku" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "regularPrice" REAL NOT NULL,
    "salePrice" REAL,
    "costPrice" REAL,
    "stockStatus" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "lowStockLevel" INTEGER NOT NULL DEFAULT 5,
    "images" JSONB NOT NULL,
    "attributes" JSONB,
    "categoryId" TEXT NOT NULL,
    "vendorId" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("attributes", "categoryId", "costPrice", "createdAt", "description", "id", "images", "inventory", "isFeatured", "isPublished", "lowStockLevel", "name", "regularPrice", "richDescription", "salePrice", "seoDescription", "seoTitle", "sku", "slug", "stockStatus", "tags", "updatedAt", "vendorId") SELECT "attributes", "categoryId", "costPrice", "createdAt", "description", "id", "images", "inventory", "isFeatured", "isPublished", "lowStockLevel", "name", "regularPrice", "richDescription", "salePrice", "seoDescription", "seoTitle", "sku", "slug", "stockStatus", "tags", "updatedAt", "vendorId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
