-- CreateEnum
CREATE TYPE "color_variants" AS ENUM ('GREEN', 'PINK', 'BLUE', 'YELLOW', 'PURPLE', 'ORANGE');

-- CreateEnum
CREATE TYPE "MessageActionType" AS ENUM ('chatCreate', 'channelCreate', 'deletePhoto', 'editTitle', 'joinedByLink', 'messagePinned', 'deleteUser', 'addUser', 'other');

-- CreateEnum
CREATE TYPE "DeletedFor" AS ENUM ('deleteForAll', 'deleteForMe');

-- CreateEnum
CREATE TYPE "chat_types" AS ENUM ('chatTypeGroup', 'chatTypeChannel', 'chatTypePrivate');

-- CreateEnum
CREATE TYPE "privacy_visibilities" AS ENUM ('Nobody', 'Everybody', 'Contacts');

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blurHash" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatFullId" TEXT,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
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
    "orderedFoldersIds" INTEGER[],
    "privacySettingsId" TEXT NOT NULL,

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
CREATE TABLE "MessageMedia" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageMediaPhoto" (
    "id" TEXT NOT NULL,
    "spoiler" BOOLEAN,
    "photoId" TEXT NOT NULL,
    "ttlSeconds" INTEGER,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageMediaPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageMediaContact" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "userId" TEXT,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageMediaContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageMediaDocument" (
    "id" TEXT NOT NULL,
    "spoiler" BOOLEAN,
    "ttlSeconds" INTEGER,
    "documentId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageMediaDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageMediaPoll" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageMediaPoll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isQuiz" BOOLEAN NOT NULL DEFAULT false,
    "multiplieChoise" BOOLEAN NOT NULL DEFAULT false,
    "closeDate" TIMESTAMP(3),
    "question" TEXT NOT NULL,
    "solution" TEXT,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollAnswer" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "isCorrect" BOOLEAN,

    CONSTRAINT "PollAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "blurHash" TEXT,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeletedMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "DeletedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "deleted_for_all" BOOLEAN,
    "entities" JSONB,
    "sender_id" TEXT NOT NULL,
    "text" TEXT,
    "isLastInChatId" TEXT,
    "silent" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "post" BOOLEAN,
    "reply_to_msg_id" TEXT,
    "post_author" TEXT,
    "views" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_folders" (
    "id" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "contacts" BOOLEAN,
    "nonContacts" BOOLEAN,
    "groups" BOOLEAN,
    "channels" BOOLEAN,
    "excludeMuted" BOOLEAN,
    "excludeReaded" BOOLEAN,
    "excludeArchived" BOOLEAN,
    "excludeUnarchived" BOOLEAN,

    CONSTRAINT "chat_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageForward" (
    "id" TEXT NOT NULL,
    "fromChatId" TEXT,
    "fromMessageId" TEXT,
    "senderUserId" TEXT,

    CONSTRAINT "MessageForward_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "user_blocks" (
    "id" TEXT NOT NULL,
    "blocker_id" TEXT NOT NULL,
    "blocked_id" TEXT NOT NULL,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "chat_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_permissions" (
    "id" TEXT NOT NULL,
    "can_send_messages" BOOLEAN NOT NULL DEFAULT true,
    "can_send_media" BOOLEAN NOT NULL DEFAULT true,
    "can_invite_users" BOOLEAN NOT NULL DEFAULT true,
    "can_pin_messages" BOOLEAN NOT NULL DEFAULT true,
    "can_change_info" BOOLEAN NOT NULL DEFAULT true,
    "chat_id" TEXT NOT NULL,
    "memberId" TEXT,

    CONSTRAINT "chat_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_admin_permissions" (
    "id" TEXT NOT NULL,
    "can_change_info" BOOLEAN DEFAULT true,
    "can_delete_messages" BOOLEAN DEFAULT true,
    "can_ban_users" BOOLEAN DEFAULT true,
    "can_invite_users" BOOLEAN DEFAULT true,
    "can_pin_messages" BOOLEAN DEFAULT true,
    "can_add_new_admins" BOOLEAN DEFAULT true,
    "userId" TEXT NOT NULL,
    "custom_title" TEXT,

    CONSTRAINT "chat_admin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "two_fa_auth" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "hint" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "two_fa_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_settings" (
    "id" TEXT NOT NULL,
    "phone_number_id" TEXT NOT NULL,
    "send_message_id" TEXT NOT NULL,
    "last_seen_id" TEXT NOT NULL,
    "profile_photo_id" TEXT NOT NULL,
    "add_forward_link_id" TEXT NOT NULL,
    "add_by_phone_id" TEXT NOT NULL,
    "chat_invite_id" TEXT NOT NULL,

    CONSTRAINT "privacy_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_rules" (
    "id" TEXT NOT NULL,
    "visibility" "privacy_visibilities" NOT NULL DEFAULT 'Everybody',

    CONSTRAINT "privacy_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeletedMessageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FolderPinnedChats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FolderIncludedChats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FolderExcludedChats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatMemberToPollAnswer" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AllowedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Photo_id_key" ON "Photo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_chatId_key" ON "Photo"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_userId_key" ON "Photo"("userId");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_privacySettingsId_key" ON "users"("privacySettingsId");

-- CreateIndex
CREATE INDEX "users_username_phone_number_id_idx" ON "users"("username", "phone_number", "id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageAction_id_key" ON "MessageAction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageAction_photoId_key" ON "MessageAction"("photoId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageAction_messageId_key" ON "MessageAction"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMedia_id_key" ON "MessageMedia"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMedia_messageId_key" ON "MessageMedia"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaPhoto_photoId_key" ON "MessageMediaPhoto"("photoId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaPhoto_messageId_key" ON "MessageMediaPhoto"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaContact_id_key" ON "MessageMediaContact"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaContact_messageId_key" ON "MessageMediaContact"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaDocument_id_key" ON "MessageMediaDocument"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaDocument_documentId_key" ON "MessageMediaDocument"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaDocument_messageId_key" ON "MessageMediaDocument"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaPoll_id_key" ON "MessageMediaPoll"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaPoll_pollId_key" ON "MessageMediaPoll"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageMediaPoll_messageId_key" ON "MessageMediaPoll"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Poll_id_key" ON "Poll"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Document_id_key" ON "Document"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedMessage_id_key" ON "DeletedMessage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_isLastInChatId_key" ON "Message"("isLastInChatId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_folders_id_key" ON "chat_folders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MessageForward_id_key" ON "MessageForward"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_blocks_blocker_id_blocked_id_key" ON "user_blocks"("blocker_id", "blocked_id");

-- CreateIndex
CREATE INDEX "chats_id_idx" ON "chats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chats_full_info_chatId_key" ON "chats_full_info"("chatId");

-- CreateIndex
CREATE INDEX "chat_members_user_id_idx" ON "chat_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_permissions_chat_id_key" ON "chat_permissions"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_permissions_memberId_key" ON "chat_permissions"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_admin_permissions_userId_key" ON "chat_admin_permissions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "two_fa_auth_email_key" ON "two_fa_auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "two_fa_auth_user_id_key" ON "two_fa_auth"("user_id");

-- CreateIndex
CREATE INDEX "two_fa_auth_user_id_idx" ON "two_fa_auth"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_settings_phone_number_id_key" ON "privacy_settings"("phone_number_id");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_settings_send_message_id_key" ON "privacy_settings"("send_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_settings_last_seen_id_key" ON "privacy_settings"("last_seen_id");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_settings_profile_photo_id_key" ON "privacy_settings"("profile_photo_id");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_settings_add_forward_link_id_key" ON "privacy_settings"("add_forward_link_id");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_settings_add_by_phone_id_key" ON "privacy_settings"("add_by_phone_id");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_settings_chat_invite_id_key" ON "privacy_settings"("chat_invite_id");

-- CreateIndex
CREATE UNIQUE INDEX "_DeletedMessageToUser_AB_unique" ON "_DeletedMessageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DeletedMessageToUser_B_index" ON "_DeletedMessageToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FolderPinnedChats_AB_unique" ON "_FolderPinnedChats"("A", "B");

-- CreateIndex
CREATE INDEX "_FolderPinnedChats_B_index" ON "_FolderPinnedChats"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FolderIncludedChats_AB_unique" ON "_FolderIncludedChats"("A", "B");

-- CreateIndex
CREATE INDEX "_FolderIncludedChats_B_index" ON "_FolderIncludedChats"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FolderExcludedChats_AB_unique" ON "_FolderExcludedChats"("A", "B");

-- CreateIndex
CREATE INDEX "_FolderExcludedChats_B_index" ON "_FolderExcludedChats"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatMemberToPollAnswer_AB_unique" ON "_ChatMemberToPollAnswer"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatMemberToPollAnswer_B_index" ON "_ChatMemberToPollAnswer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AllowedUsers_AB_unique" ON "_AllowedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_AllowedUsers_B_index" ON "_AllowedUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockedUsers_AB_unique" ON "_BlockedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockedUsers_B_index" ON "_BlockedUsers"("B");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_chatFullId_fkey" FOREIGN KEY ("chatFullId") REFERENCES "chats_full_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_privacySettingsId_fkey" FOREIGN KEY ("privacySettingsId") REFERENCES "privacy_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAction" ADD CONSTRAINT "MessageAction_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAction" ADD CONSTRAINT "MessageAction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMedia" ADD CONSTRAINT "MessageMedia_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMediaPhoto" ADD CONSTRAINT "MessageMediaPhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMediaPhoto" ADD CONSTRAINT "MessageMediaPhoto_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MessageMedia"("messageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMediaContact" ADD CONSTRAINT "MessageMediaContact_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MessageMedia"("messageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMediaDocument" ADD CONSTRAINT "MessageMediaDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMediaDocument" ADD CONSTRAINT "MessageMediaDocument_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MessageMedia"("messageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMediaPoll" ADD CONSTRAINT "MessageMediaPoll_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMediaPoll" ADD CONSTRAINT "MessageMediaPoll_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MessageMedia"("messageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollAnswer" ADD CONSTRAINT "PollAnswer_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeletedMessage" ADD CONSTRAINT "DeletedMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_isLastInChatId_fkey" FOREIGN KEY ("isLastInChatId") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat_folders" ADD CONSTRAINT "chat_folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats_full_info" ADD CONSTRAINT "chats_full_info_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats_full_info"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_permissions" ADD CONSTRAINT "chat_permissions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_permissions" ADD CONSTRAINT "chat_permissions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "chat_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_admin_permissions" ADD CONSTRAINT "chat_admin_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "chat_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "two_fa_auth" ADD CONSTRAINT "two_fa_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_settings" ADD CONSTRAINT "privacy_settings_phone_number_id_fkey" FOREIGN KEY ("phone_number_id") REFERENCES "privacy_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_settings" ADD CONSTRAINT "privacy_settings_send_message_id_fkey" FOREIGN KEY ("send_message_id") REFERENCES "privacy_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_settings" ADD CONSTRAINT "privacy_settings_last_seen_id_fkey" FOREIGN KEY ("last_seen_id") REFERENCES "privacy_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_settings" ADD CONSTRAINT "privacy_settings_profile_photo_id_fkey" FOREIGN KEY ("profile_photo_id") REFERENCES "privacy_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_settings" ADD CONSTRAINT "privacy_settings_add_forward_link_id_fkey" FOREIGN KEY ("add_forward_link_id") REFERENCES "privacy_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_settings" ADD CONSTRAINT "privacy_settings_add_by_phone_id_fkey" FOREIGN KEY ("add_by_phone_id") REFERENCES "privacy_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_settings" ADD CONSTRAINT "privacy_settings_chat_invite_id_fkey" FOREIGN KEY ("chat_invite_id") REFERENCES "privacy_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeletedMessageToUser" ADD CONSTRAINT "_DeletedMessageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "DeletedMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeletedMessageToUser" ADD CONSTRAINT "_DeletedMessageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderPinnedChats" ADD CONSTRAINT "_FolderPinnedChats_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderPinnedChats" ADD CONSTRAINT "_FolderPinnedChats_B_fkey" FOREIGN KEY ("B") REFERENCES "chat_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderIncludedChats" ADD CONSTRAINT "_FolderIncludedChats_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderIncludedChats" ADD CONSTRAINT "_FolderIncludedChats_B_fkey" FOREIGN KEY ("B") REFERENCES "chat_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderExcludedChats" ADD CONSTRAINT "_FolderExcludedChats_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderExcludedChats" ADD CONSTRAINT "_FolderExcludedChats_B_fkey" FOREIGN KEY ("B") REFERENCES "chat_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatMemberToPollAnswer" ADD CONSTRAINT "_ChatMemberToPollAnswer_A_fkey" FOREIGN KEY ("A") REFERENCES "chat_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatMemberToPollAnswer" ADD CONSTRAINT "_ChatMemberToPollAnswer_B_fkey" FOREIGN KEY ("B") REFERENCES "PollAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllowedUsers" ADD CONSTRAINT "_AllowedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "privacy_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllowedUsers" ADD CONSTRAINT "_AllowedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUsers" ADD CONSTRAINT "_BlockedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "privacy_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUsers" ADD CONSTRAINT "_BlockedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
