-- CreateEnum
CREATE TYPE "ProviderEnum" AS ENUM ('GOOGLE', 'APPLE', 'MICROSOFT', 'CREDENTIAL');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('REFRESH', 'ACCESS');

-- CreateEnum
CREATE TYPE "PlatformEnum" AS ENUM ('PHONE', 'WEB');

-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('BASIC', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "MediaFileTypes" AS ENUM ('DOC', 'IMAGE', 'AUDIO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "provider_id" TEXT,
    "provider" "ProviderEnum" NOT NULL DEFAULT 'CREDENTIAL',
    "phone" TEXT,
    "profile_picture" TEXT,
    "bio" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "role" "RoleEnum" NOT NULL DEFAULT 'BASIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenUser" (
    "id" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" "PlatformEnum" NOT NULL DEFAULT 'WEB',
    "deviceId" TEXT NOT NULL,
    "token_ref" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "TokenUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForgotPasswordToken" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "otp_code" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ForgotPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaFile" (
    "id" TEXT NOT NULL,
    "file_type" "MediaFileTypes" NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TokenUser_id_key" ON "TokenUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TokenUser_token_ref_key" ON "TokenUser"("token_ref");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordToken_user_id_key" ON "ForgotPasswordToken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordToken_token_key" ON "ForgotPasswordToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordToken_otp_code_key" ON "ForgotPasswordToken"("otp_code");

-- AddForeignKey
ALTER TABLE "TokenUser" ADD CONSTRAINT "TokenUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForgotPasswordToken" ADD CONSTRAINT "ForgotPasswordToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
