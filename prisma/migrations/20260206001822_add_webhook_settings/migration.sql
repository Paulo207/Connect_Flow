-- AlterTable
ALTER TABLE "Instance" ADD COLUMN     "settingsDisableQueue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "settingsNotifyOwn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "settingsReadMessages" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "settingsReadStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "settingsRejectCalls" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "webhookUrlConnect" TEXT,
ADD COLUMN     "webhookUrlDisconnect" TEXT,
ADD COLUMN     "webhookUrlReceive" TEXT,
ADD COLUMN     "webhookUrlSend" TEXT;
