-- CreateEnum
CREATE TYPE "color_variants" AS ENUM ('GREEN', 'PINK', 'BLUE', 'YELLOW', 'PURPLE', 'ORANGE');

-- CreateEnum
CREATE TYPE "MessageActionType" AS ENUM ('chatCreate', 'channelCreate', 'deletePhoto', 'editTitle', 'joinedByLink', 'messagePinned', 'deleteUser', 'addUser', 'other');

-- CreateEnum
CREATE TYPE "chat_types" AS ENUM ('chatTypeGroup', 'chatTypeChannel', 'chatTypePrivate');

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blurHash" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "chatId" TEXT,
    "userId" TEXT,
    "width" INTEGER,
    "height" INTEGER,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "phone_number" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "bio" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "lastActivity" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "color" "color_variants" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAction" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "photoId" TEXT,
    "type" "MessageActionType" NOT NULL DEFAULT 'other',
    "messageId" TEXT NOT NULL,
    "users" TEXT[],
    "values" TEXT[],

    CONSTRAINT "MessageAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "ordered_id" INTEGER NOT NULL,
    "chatId" TEXT NOT NULL,
    "pinned_for_all" BOOLEAN,
    "entities" JSONB,
    "sender_id" TEXT NOT NULL,
    "text" TEXT,
    "isLastInChatId" TEXT,
    "silent" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "post" BOOLEAN,
    "reply_to_msg_id" TEXT,
    "post_author" TEXT,
    "views" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "owner_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "color" "color_variants" NOT NULL,
    "title" TEXT NOT NULL,
    "inviteLink" TEXT,
    "is_private" BOOLEAN,
    "isService" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "chat_types" NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats_full_info" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "history_for_new_members" BOOLEAN DEFAULT true,
    "canViewMembers" BOOLEAN DEFAULT true,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "chats_full_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_members" (
    "id" TEXT NOT NULL,
    "is_pinned" BOOLEAN DEFAULT false,
    "is_muted" BOOLEAN DEFAULT false,
    "is_archived" BOOLEAN DEFAULT false,
    "isAdmin" BOOLEAN,
    "isOwner" BOOLEAN,
    "unread_count" INTEGER DEFAULT 0,
    "draft" TEXT,
    "joinedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "inviter_id" TEXT,
    "promoted_by_id" TEXT,
    "kicked_by_id" TEXT,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lastReadIncomingMessageId" INTEGER DEFAULT 0,

    CONSTRAINT "chat_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "photos_id_key" ON "photos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "photos_chatId_key" ON "photos"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "photos_userId_key" ON "photos"("userId");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_username_phone_number_id_idx" ON "users"("username", "phone_number", "id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageAction_id_key" ON "MessageAction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageAction_photoId_key" ON "MessageAction"("photoId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageAction_messageId_key" ON "MessageAction"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_isLastInChatId_key" ON "Message"("isLastInChatId");

-- CreateIndex
CREATE INDEX "chats_id_idx" ON "chats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chats_full_info_chatId_key" ON "chats_full_info"("chatId");

-- CreateIndex
CREATE INDEX "chat_members_user_id_idx" ON "chat_members"("user_id");

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAction" ADD CONSTRAINT "MessageAction_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAction" ADD CONSTRAINT "MessageAction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_isLastInChatId_fkey" FOREIGN KEY ("isLastInChatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats_full_info" ADD CONSTRAINT "chats_full_info_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats_full_info"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
