/*
  Warnings:

  - The `condition` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Car` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_categoryId_fkey";

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "acceptsTrade" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "offerPrice" DOUBLE PRECISION,
ADD COLUMN     "reserved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "saleType" TEXT,
ADD COLUMN     "shortDesc" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "sold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transferable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "uniqueOwner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "version" TEXT,
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "transmission" DROP NOT NULL,
ALTER COLUMN "fuelType" DROP NOT NULL,
DROP COLUMN "condition",
ADD COLUMN     "condition" TEXT,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Car_slug_key" ON "Car"("slug");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
