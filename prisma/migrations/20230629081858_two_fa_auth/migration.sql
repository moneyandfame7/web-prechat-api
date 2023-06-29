-- CreateTable
CREATE TABLE "two_fa_auth" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hint" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "two_fa_auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "two_fa_auth_email_key" ON "two_fa_auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "two_fa_auth_userId_key" ON "two_fa_auth"("userId");

-- AddForeignKey
ALTER TABLE "two_fa_auth" ADD CONSTRAINT "two_fa_auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
