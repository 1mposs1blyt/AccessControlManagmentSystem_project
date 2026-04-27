-- AlterEnum
ALTER TYPE "CheckinType" ADD VALUE 'NONE';

-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_userId_fkey";

-- AlterTable
ALTER TABLE "Checkin" ALTER COLUMN "type" SET DEFAULT 'NONE';

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
