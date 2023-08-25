-- CreateEnum
CREATE TYPE "avatar_variants" AS ENUM ('GREEN', 'PINK', 'BLUE', 'YELLOW', 'PURPLE', 'ORANGE');

-- CreateEnum
CREATE TYPE "chat_types" AS ENUM ('chatTypeGroup', 'chatTypeChannel', 'chatTypePrivate');

-- CreateEnum
CREATE TYPE "privacy_visibilities" AS ENUM ('Nobody', 'Everybody', 'Contacts');

-- CreateTable
CREATE TABLE "chat_avatars" (
    "id" TEXT NOT NULL,
    "avatar_variant" "avatar_variants" NOT NULL,

    CONSTRAINT "chat_avatars_pkey" PRIMARY KEY ("id")
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "full_info_id" TEXT NOT NULL,
    "privacySettingsId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "api_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "api_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "is_private" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "chat_types" NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats_full_info" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "history_for_new_members" BOOLEAN DEFAULT true,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "chats_full_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_members" (
    "id" TEXT NOT NULL,
    "is_pinned" BOOLEAN DEFAULT false,
    "is_muted" BOOLEAN DEFAULT false,
    "unread_count" INTEGER DEFAULT 0,
    "inviter_id" TEXT,
    "promoted_by_id" TEXT,
    "kicked_by_id" TEXT,
    "isAdmin" BOOLEAN,
    "isOwner" BOOLEAN,
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

    CONSTRAINT "chat_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_admin_rights" (
    "id" TEXT NOT NULL,
    "can_change_info" BOOLEAN DEFAULT true,
    "can_delete_messages" BOOLEAN DEFAULT true,
    "can_ban_users" BOOLEAN DEFAULT true,
    "can_invite_users" BOOLEAN DEFAULT true,
    "can_pin_messages" BOOLEAN DEFAULT true,
    "can_add_new_admins" BOOLEAN DEFAULT true,
    "userId" TEXT NOT NULL,
    "custom_title" TEXT,

    CONSTRAINT "chat_admin_rights_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "users_full_info" (
    "id" TEXT NOT NULL,
    "avatar_id" TEXT NOT NULL,
    "bio" TEXT,

    CONSTRAINT "users_full_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_settings" (
    "id" TEXT NOT NULL,
    "phone_number_id" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_full_info_id_key" ON "users"("full_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_privacySettingsId_key" ON "users"("privacySettingsId");

-- CreateIndex
CREATE INDEX "users_username_phone_number_id_idx" ON "users"("username", "phone_number", "id");

-- CreateIndex
CREATE UNIQUE INDEX "user_blocks_blocker_id_blocked_id_key" ON "user_blocks"("blocker_id", "blocked_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_tokens_user_id_key" ON "api_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chats_full_info_chat_id_key" ON "chats_full_info"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_members_chat_id_key" ON "chat_members"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_permissions_chat_id_key" ON "chat_permissions"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_admin_rights_userId_key" ON "chat_admin_rights"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "two_fa_auth_email_key" ON "two_fa_auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "two_fa_auth_user_id_key" ON "two_fa_auth"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_full_info_avatar_id_key" ON "users_full_info"("avatar_id");

-- CreateIndex
CREATE UNIQUE INDEX "privacy_settings_phone_number_id_key" ON "privacy_settings"("phone_number_id");

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
CREATE UNIQUE INDEX "_AllowedUsers_AB_unique" ON "_AllowedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_AllowedUsers_B_index" ON "_AllowedUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockedUsers_AB_unique" ON "_BlockedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockedUsers_B_index" ON "_BlockedUsers"("B");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_full_info_id_fkey" FOREIGN KEY ("full_info_id") REFERENCES "users_full_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_privacySettingsId_fkey" FOREIGN KEY ("privacySettingsId") REFERENCES "privacy_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_tokens" ADD CONSTRAINT "api_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats_full_info" ADD CONSTRAINT "chats_full_info_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats_full_info"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_permissions" ADD CONSTRAINT "chat_permissions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_admin_rights" ADD CONSTRAINT "chat_admin_rights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "chat_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "two_fa_auth" ADD CONSTRAINT "two_fa_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_full_info" ADD CONSTRAINT "users_full_info_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "chat_avatars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_settings" ADD CONSTRAINT "privacy_settings_phone_number_id_fkey" FOREIGN KEY ("phone_number_id") REFERENCES "privacy_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "_AllowedUsers" ADD CONSTRAINT "_AllowedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "privacy_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllowedUsers" ADD CONSTRAINT "_AllowedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUsers" ADD CONSTRAINT "_BlockedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "privacy_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUsers" ADD CONSTRAINT "_BlockedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
