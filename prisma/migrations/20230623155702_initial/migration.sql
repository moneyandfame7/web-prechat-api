-- CreateEnum
CREATE TYPE "avatar_variants" AS ENUM ('GREEN', 'PINK', 'BLUE', 'YELLOW', 'PURPLE', 'ORANGE');

-- CreateEnum
CREATE TYPE "who_can" AS ENUM ('EVERYBODY', 'CONTACTS', 'NOBODY');

-- CreateEnum
CREATE TYPE "chat_types" AS ENUM ('Group', 'Channel', 'Private');

-- CreateTable
CREATE TABLE "chat_avatars" (
    "id" TEXT NOT NULL,
    "avatar_variant" "avatar_variants" NOT NULL,

    CONSTRAINT "chat_avatars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat_avatar_id" TEXT NOT NULL,
    "message_id" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "who_can_see_phone" "who_can" NOT NULL DEFAULT 'EVERYBODY',
    "who_can_see_status" "who_can" NOT NULL DEFAULT 'EVERYBODY',
    "who_can_see_photo" "who_can" NOT NULL DEFAULT 'EVERYBODY',
    "who_can_add_to_groups" "who_can" NOT NULL DEFAULT 'EVERYBODY',

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_private" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "chat_types" NOT NULL,
    "avatar_id" TEXT NOT NULL,
    "last_message_id" TEXT,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_to_users" (
    "id" TEXT NOT NULL,
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "is_unread" BOOLEAN NOT NULL DEFAULT true,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_creator" BOOLEAN NOT NULL DEFAULT false,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "chat_to_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "can_add" BOOLEAN NOT NULL DEFAULT true,
    "can_change_info" BOOLEAN NOT NULL DEFAULT true,
    "can_send" BOOLEAN NOT NULL DEFAULT true,
    "can_send_media" BOOLEAN NOT NULL DEFAULT true,
    "history_for_new_members" BOOLEAN NOT NULL DEFAULT false,
    "chat_id" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewedMessages" (
    "id" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewerId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "ViewedMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "is_silent" BOOLEAN NOT NULL DEFAULT false,
    "message_content_id" TEXT NOT NULL,
    "views" INTEGER,
    "chat_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_contents" (
    "id" TEXT NOT NULL,
    "text" TEXT,

    CONSTRAINT "message_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forward_messages" (
    "id" TEXT NOT NULL,
    "isChannelMessage" BOOLEAN NOT NULL,
    "message_id" TEXT NOT NULL,

    CONSTRAINT "forward_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExcludeForSeePhone" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExcludeForSeeStatus" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExcludeForSeePhoto" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExcludeForAdding" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "images_message_id_key" ON "images"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_avatar_id_key" ON "users"("avatar_id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_id_key" ON "settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_user_id_key" ON "contacts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chats_avatar_id_key" ON "chats"("avatar_id");

-- CreateIndex
CREATE UNIQUE INDEX "chats_last_message_id_key" ON "chats"("last_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_to_users_user_id_key" ON "chat_to_users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_to_users_chat_id_key" ON "chat_to_users"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_chat_id_key" ON "permissions"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "ViewedMessages_viewerId_key" ON "ViewedMessages"("viewerId");

-- CreateIndex
CREATE UNIQUE INDEX "ViewedMessages_messageId_key" ON "ViewedMessages"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "messages_message_content_id_key" ON "messages"("message_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_chat_id_key" ON "messages"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_sender_id_key" ON "messages"("sender_id");

-- CreateIndex
CREATE UNIQUE INDEX "forward_messages_message_id_key" ON "forward_messages"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ExcludeForSeePhone_AB_unique" ON "_ExcludeForSeePhone"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcludeForSeePhone_B_index" ON "_ExcludeForSeePhone"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExcludeForSeeStatus_AB_unique" ON "_ExcludeForSeeStatus"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcludeForSeeStatus_B_index" ON "_ExcludeForSeeStatus"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExcludeForSeePhoto_AB_unique" ON "_ExcludeForSeePhoto"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcludeForSeePhoto_B_index" ON "_ExcludeForSeePhoto"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExcludeForAdding_AB_unique" ON "_ExcludeForAdding"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcludeForAdding_B_index" ON "_ExcludeForAdding"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockedUsers_AB_unique" ON "_BlockedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockedUsers_B_index" ON "_BlockedUsers"("B");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_chat_avatar_id_fkey" FOREIGN KEY ("chat_avatar_id") REFERENCES "chat_avatars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "message_contents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "chat_avatars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "chat_avatars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_to_users" ADD CONSTRAINT "chat_to_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_to_users" ADD CONSTRAINT "chat_to_users_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewedMessages" ADD CONSTRAINT "ViewedMessages_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewedMessages" ADD CONSTRAINT "ViewedMessages_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_message_content_id_fkey" FOREIGN KEY ("message_content_id") REFERENCES "message_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forward_messages" ADD CONSTRAINT "forward_messages_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcludeForSeePhone" ADD CONSTRAINT "_ExcludeForSeePhone_A_fkey" FOREIGN KEY ("A") REFERENCES "settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcludeForSeePhone" ADD CONSTRAINT "_ExcludeForSeePhone_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcludeForSeeStatus" ADD CONSTRAINT "_ExcludeForSeeStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcludeForSeeStatus" ADD CONSTRAINT "_ExcludeForSeeStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcludeForSeePhoto" ADD CONSTRAINT "_ExcludeForSeePhoto_A_fkey" FOREIGN KEY ("A") REFERENCES "settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcludeForSeePhoto" ADD CONSTRAINT "_ExcludeForSeePhoto_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcludeForAdding" ADD CONSTRAINT "_ExcludeForAdding_A_fkey" FOREIGN KEY ("A") REFERENCES "settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcludeForAdding" ADD CONSTRAINT "_ExcludeForAdding_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUsers" ADD CONSTRAINT "_BlockedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUsers" ADD CONSTRAINT "_BlockedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
