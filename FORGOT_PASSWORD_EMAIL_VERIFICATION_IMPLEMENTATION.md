# Forgot Password & Email Verification Implementation Guide

**Project:** Total Travel Solution Group
**Created:** January 2026
**Status:** 🔄 Backend Complete - Frontend In Progress
**Last Updated:** January 25, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Current State Analysis](#current-state-analysis)
3. [What Needs to Be Implemented](#what-needs-to-be-implemented)
4. [Database Schema Changes](#database-schema-changes)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Email Templates](#email-templates)
8. [Configuration Settings](#configuration-settings)
9. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
10. [Testing Checklist](#testing-checklist)
11. [Security Considerations](#security-considerations)

---

## Overview

### Features to Implement

1. **Forgot Password Flow**
   - User enters email → System sends 6-digit OTP via email
   - User enters OTP + new password → Password is reset
   - OTP expires after 15 minutes
   - Rate limiting: 60 seconds between OTP resends

2. **Email Verification Flow**
   - After registration, user receives 6-digit OTP via email
   - User enters OTP → Email is verified (`isEmailVerified = true`)
   - Optional: Block unverified users from certain actions
   - OTP expires after 15 minutes

### Technology Stack

- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** Next.js 15 (App Router)
- **Email Service:** Resend (configured with `no-reply@totaltravelsolutiongroup.com`)
- **Validation:** Zod schemas
- **Authentication:** JWT tokens

---

## Current State Analysis

### ✅ What Already Exists

#### Backend (`/Users/macbookpro/Desktop/Traning/Next Js/tts-api`)

**1. Database Schema (`prisma/schema.prisma`)**

```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  password        String
  firstName       String
  lastName        String
  phoneNumber     String?
  role            UserRole
  isEmailVerified Boolean  @default(false) ✅ Already exists
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // ... other relations
}
```

**2. Auth Endpoints (`src/auth/auth.controller.ts`)**

| Endpoint | Status | Location |
|----------|--------|----------|
| `POST /auth/register` | ✅ Working | `src/auth/auth.controller.ts:28-64` |
| `POST /auth/login` | ✅ Working | `src/auth/auth.controller.ts:66-85` |
| `POST /auth/forgot-password` | ✅ Complete | `src/auth/auth.controller.ts:97-108` |
| `POST /auth/reset-password` | ✅ Complete | `src/auth/auth.controller.ts:110-121` |
| `POST /auth/send-verification-otp` | ✅ Complete | `src/auth/auth.controller.ts:123-134` |
| `POST /auth/verify-email` | ✅ Complete | `src/auth/auth.controller.ts:136-146` |
| `POST /auth/resend-otp` | ✅ Complete | `src/auth/auth.controller.ts:148-164` |

**3. Email Service (`src/integrations/resend/resend.service.ts`)**

| Email Template | Status | Location |
|----------------|--------|----------|
| Welcome Email | ✅ Working | Line 408-610 |
| Booking Confirmation | ✅ Working | Line 129-140 |
| Driver Assigned | ✅ Working | Line 145-156 |
| Password Reset OTP | ✅ Complete | Line 628-714 |
| Email Verification OTP | ✅ Complete | Line 716-812 |

**4. Resend Configuration (`.env`)**

```bash
RESEND_API_KEY="re_FJDpe19y_QDsC9wvAZJZrRVnHmgzH1M9a"
FROM_EMAIL="no-reply@totaltravelsolutiongroup.com"
```

#### Frontend (`/Users/macbookpro/Desktop/Traning/Next Js/tts-app`)

**1. Auth Types (`lib/types/auth.types.ts`)**

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: UserRole;
  isEmailVerified: boolean; ✅ Already exists
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**2. Auth API Functions (`lib/api/auth.api.ts`)**

| Function | Status | Location |
|----------|--------|----------|
| `register()` | ✅ Working | Line 23-26 |
| `login()` | ✅ Working | Line 32-53 |
| `logout()` | ✅ Working | Line 58-69 |
| `getCurrentUser()` | ✅ Working | Line 74-86 |
| `forgotPassword()` | ❌ Missing | - |
| `resetPassword()` | ❌ Missing | - |
| `sendVerificationOTP()` | ❌ Missing | - |
| `verifyEmail()` | ❌ Missing | - |
| `resendOTP()` | ❌ Missing | - |

---

## What Needs to Be Implemented

### ❌ Backend Tasks

1. **Database Migration**
   - Create `OtpToken` table for storing OTPs
   - Add relation to `User` model

2. **DTOs (Data Transfer Objects)**
   - `forgot-password.dto.ts`
   - `reset-password.dto.ts`
   - `send-verification-otp.dto.ts`
   - `verify-email.dto.ts`
   - `resend-otp.dto.ts`

3. **Auth Service Methods**
   - `generateOTP()` - Generate 6-digit random code
   - `storeOTP()` - Save OTP to database
   - `validateOTP()` - Check if OTP is valid and not expired
   - `sendPasswordResetOTP()` - Send OTP via email
   - `resetPassword()` - Verify OTP and update password
   - `sendEmailVerificationOTP()` - Send verification OTP
   - `verifyEmail()` - Verify OTP and mark email as verified

4. **Email Templates**
   - Password Reset OTP email (branded with Teal colors)
   - Email Verification OTP email (branded with Teal colors)

5. **Auth Controller Endpoints**
   - `POST /auth/forgot-password` - Request password reset OTP
   - `POST /auth/reset-password` - Reset password with OTP
   - `POST /auth/send-verification-otp` - Send email verification OTP
   - `POST /auth/verify-email` - Verify email with OTP
   - `POST /auth/resend-otp` - Resend OTP with cooldown

### ❌ Frontend Tasks

1. **API Functions** (`lib/api/auth.api.ts`)
   - `forgotPassword(email: string)` → sends OTP
   - `resetPassword(email: string, otp: string, newPassword: string)` → resets password
   - `sendVerificationOTP(email: string)` → sends verification OTP
   - `verifyEmail(email: string, otp: string)` → verifies email
   - `resendOTP(email: string, type: 'PASSWORD_RESET' | 'EMAIL_VERIFICATION')` → resends OTP

2. **Pages & Routes**

| Page | URL | File Path | Purpose |
|------|-----|-----------|---------|
| Forgot Password | `/forgot-password` | `app/forgot-password/page.tsx` | Enter email to request OTP |
| Reset Password | `/reset-password` | `app/reset-password/page.tsx` | Enter OTP + new password |
| Verify Email | `/verify-email` | `app/verify-email/page.tsx` | Enter OTP to verify email |

3. **Components** (Optional)
   - `components/auth/OTPInput.tsx` - Reusable 6-digit OTP input
   - `components/auth/ResendOTPButton.tsx` - Button with 60s cooldown timer

---

## Database Schema Changes

### New Table: `OtpToken`

**File:** `prisma/schema.prisma`

```prisma
model OtpToken {
  id        String   @id @default(cuid())
  userId    String
  email     String   // Store email for lookup
  otp       String   // 6-digit code (hashed or plain, decide based on security needs)
  type      OtpType  // PASSWORD_RESET or EMAIL_VERIFICATION
  expiresAt DateTime // 15 minutes from creation
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([email, type])
  @@index([expiresAt])
  @@map("otp_tokens")
}

enum OtpType {
  PASSWORD_RESET
  EMAIL_VERIFICATION
}
```

### Update User Model

```prisma
model User {
  id              String     @id @default(cuid())
  email           String     @unique
  password        String
  firstName       String
  lastName        String
  phoneNumber     String?
  role            UserRole
  isEmailVerified Boolean    @default(false)
  isActive        Boolean    @default(true)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  // Add this relation
  otpTokens       OtpToken[] // New relation

  // ... existing relations
  bookingGroups   BookingGroup[]
  bookings        Booking[]
  notifications   Notification[]
  operatorProfile OperatorProfile?

  @@map("users")
}
```

### Migration Command

```bash
cd /Users/macbookpro/Desktop/Traning/Next\ Js/tts-api
npx prisma migrate dev --name add_otp_token_table
```

---

## Backend Implementation

### 1. DTOs (Data Transfer Objects)

#### **File:** `src/auth/dto/forgot-password.dto.ts`

```typescript
import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
```

#### **File:** `src/auth/dto/reset-password.dto.ts`

```typescript
import { z } from 'zod';

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
```

#### **File:** `src/auth/dto/send-verification-otp.dto.ts`

```typescript
import { z } from 'zod';

export const SendVerificationOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type SendVerificationOtpDto = z.infer<typeof SendVerificationOtpSchema>;
```

#### **File:** `src/auth/dto/verify-email.dto.ts`

```typescript
import { z } from 'zod';

export const VerifyEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type VerifyEmailDto = z.infer<typeof VerifyEmailSchema>;
```

#### **File:** `src/auth/dto/resend-otp.dto.ts`

```typescript
import { z } from 'zod';

export const ResendOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  type: z.enum(['PASSWORD_RESET', 'EMAIL_VERIFICATION']),
});

export type ResendOtpDto = z.infer<typeof ResendOtpSchema>;
```

---

### 2. OTP Service

#### **File:** `src/auth/otp.service.ts` (New File)

```typescript
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a random 6-digit OTP
   */
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Store OTP in database with 15-minute expiry
   */
  async storeOTP(
    userId: string,
    email: string,
    type: 'PASSWORD_RESET' | 'EMAIL_VERIFICATION',
  ): Promise<string> {
    const otp = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes

    // Invalidate previous OTPs of same type for this user
    await this.prisma.otpToken.updateMany({
      where: {
        email,
        type,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Create new OTP
    await this.prisma.otpToken.create({
      data: {
        userId,
        email,
        otp,
        type,
        expiresAt,
      },
    });

    return otp;
  }

  /**
   * Validate OTP (check if valid, not used, not expired)
   */
  async validateOTP(
    email: string,
    otp: string,
    type: 'PASSWORD_RESET' | 'EMAIL_VERIFICATION',
  ): Promise<boolean> {
    const otpToken = await this.prisma.otpToken.findFirst({
      where: {
        email,
        otp,
        type,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpToken) {
      return false;
    }

    // Mark OTP as used
    await this.prisma.otpToken.update({
      where: { id: otpToken.id },
      data: { used: true },
    });

    return true;
  }

  /**
   * Check if user can request new OTP (60 second cooldown)
   */
  async canRequestNewOTP(
    email: string,
    type: 'PASSWORD_RESET' | 'EMAIL_VERIFICATION',
  ): Promise<boolean> {
    const lastOtp = await this.prisma.otpToken.findFirst({
      where: {
        email,
        type,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!lastOtp) return true;

    const cooldownPeriod = 60 * 1000; // 60 seconds
    const timeSinceLastOtp = Date.now() - lastOtp.createdAt.getTime();

    return timeSinceLastOtp >= cooldownPeriod;
  }

  /**
   * Clean up expired OTPs (run periodically via cron)
   */
  async cleanupExpiredOTPs(): Promise<void> {
    await this.prisma.otpToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    this.logger.log('Expired OTPs cleaned up');
  }
}
```

---

### 3. Update Auth Service

#### **File:** `src/auth/auth.service.ts`

Add these methods to existing `AuthService`:

```typescript
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { OtpService } from './otp.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import * as bcrypt from 'bcrypt';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly resendService: ResendService,
  ) {}

  // ... existing methods (validateUser, login)

  /**
   * Send password reset OTP to user's email
   */
  async sendPasswordResetOTP(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check cooldown
    const canRequest = await this.otpService.canRequestNewOTP(email, 'PASSWORD_RESET');
    if (!canRequest) {
      throw new BadRequestException('Please wait 60 seconds before requesting a new OTP');
    }

    // Generate and store OTP
    const otp = await this.otpService.storeOTP(user.id, email, 'PASSWORD_RESET');

    // Send OTP via email
    await this.resendService.sendPasswordResetOTP(email, {
      firstName: user.firstName,
      otp,
    });
  }

  /**
   * Reset password using OTP
   */
  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate OTP
    const isValid = await this.otpService.validateOTP(email, otp, 'PASSWORD_RESET');
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.usersService.update(user.id, {
      password: hashedPassword,
    });
  }

  /**
   * Send email verification OTP
   */
  async sendEmailVerificationOTP(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Check cooldown
    const canRequest = await this.otpService.canRequestNewOTP(email, 'EMAIL_VERIFICATION');
    if (!canRequest) {
      throw new BadRequestException('Please wait 60 seconds before requesting a new OTP');
    }

    // Generate and store OTP
    const otp = await this.otpService.storeOTP(user.id, email, 'EMAIL_VERIFICATION');

    // Send OTP via email
    await this.resendService.sendEmailVerificationOTP(email, {
      firstName: user.firstName,
      otp,
    });
  }

  /**
   * Verify email using OTP
   */
  async verifyEmail(email: string, otp: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Validate OTP
    const isValid = await this.otpService.validateOTP(email, otp, 'EMAIL_VERIFICATION');
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark email as verified
    await this.usersService.update(user.id, {
      isEmailVerified: true,
    });
  }
}
```

---

### 4. Update Auth Controller

#### **File:** `src/auth/auth.controller.ts`

Add these endpoints:

```typescript
import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';
import { RegisterSchema } from './dto/register.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import { LoginSchema } from './dto/login.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordSchema } from './dto/forgot-password.dto.js';
import type { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordSchema } from './dto/reset-password.dto.js';
import type { ResetPasswordDto } from './dto/reset-password.dto.js';
import { SendVerificationOtpSchema } from './dto/send-verification-otp.dto.js';
import type { SendVerificationOtpDto } from './dto/send-verification-otp.dto.js';
import { VerifyEmailSchema } from './dto/verify-email.dto.js';
import type { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendOtpSchema } from './dto/resend-otp.dto.js';
import type { ResendOtpDto } from './dto/resend-otp.dto.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { ResendService } from '../integrations/resend/resend.service.js';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly resendService: ResendService,
  ) {}

  // ... existing endpoints (register, login)

  /**
   * Request password reset OTP
   * POST /auth/forgot-password
   */
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 requests per 5 minutes
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordSchema)) dto: ForgotPasswordDto,
  ) {
    try {
      await this.authService.sendPasswordResetOTP(dto.email);
      return {
        success: true,
        message: 'Password reset OTP sent to your email',
      };
    } catch (error: any) {
      this.logger.error(`Forgot password error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reset password using OTP
   * POST /auth/reset-password
   */
  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 requests per 5 minutes
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordSchema)) dto: ResetPasswordDto,
  ) {
    try {
      await this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error: any) {
      this.logger.error(`Reset password error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send email verification OTP
   * POST /auth/send-verification-otp
   */
  @Post('send-verification-otp')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 requests per 5 minutes
  async sendVerificationOTP(
    @Body(new ZodValidationPipe(SendVerificationOtpSchema)) dto: SendVerificationOtpDto,
  ) {
    try {
      await this.authService.sendEmailVerificationOTP(dto.email);
      return {
        success: true,
        message: 'Verification OTP sent to your email',
      };
    } catch (error: any) {
      this.logger.error(`Send verification OTP error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify email using OTP
   * POST /auth/verify-email
   */
  @Post('verify-email')
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 requests per 5 minutes
  async verifyEmail(
    @Body(new ZodValidationPipe(VerifyEmailSchema)) dto: VerifyEmailDto,
  ) {
    try {
      await this.authService.verifyEmail(dto.email, dto.otp);
      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error: any) {
      this.logger.error(`Verify email error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Resend OTP (for both password reset and email verification)
   * POST /auth/resend-otp
   */
  @Post('resend-otp')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 requests per 5 minutes
  async resendOTP(
    @Body(new ZodValidationPipe(ResendOtpSchema)) dto: ResendOtpDto,
  ) {
    try {
      if (dto.type === 'PASSWORD_RESET') {
        await this.authService.sendPasswordResetOTP(dto.email);
      } else {
        await this.authService.sendEmailVerificationOTP(dto.email);
      }
      return {
        success: true,
        message: 'OTP resent successfully',
      };
    } catch (error: any) {
      this.logger.error(`Resend OTP error: ${error.message}`);
      throw error;
    }
  }
}
```

---

### 5. Update Auth Module

#### **File:** `src/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UsersModule } from '../users/users.module.js';
import { ResendModule } from '../integrations/resend/resend.module.js';
import { OtpService } from './otp.service.js'; // Add this
import { PrismaService } from '../database/prisma.service.js'; // Add this

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ResendModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any,
    }),
  ],
  providers: [AuthService, JwtStrategy, OtpService, PrismaService], // Add OtpService, PrismaService
  controllers: [AuthController],
})
export class AuthModule {}
```

---

## Email Templates

### Add to `src/integrations/resend/resend.service.ts`

#### 1. Password Reset OTP Interface

```typescript
export interface PasswordResetOtpData {
  firstName: string;
  otp: string;
}
```

#### 2. Email Verification OTP Interface

```typescript
export interface EmailVerificationOtpData {
  firstName: string;
  otp: string;
}
```

#### 3. Password Reset OTP Method

```typescript
/**
 * Send password reset OTP email
 */
async sendPasswordResetOTP(
  email: string,
  data: PasswordResetOtpData,
): Promise<boolean> {
  const html = this.getPasswordResetOtpHtml(data);

  return this.sendEmail({
    to: email,
    subject: 'Password Reset - Total Travel Solution Group',
    html,
  });
}
```

#### 4. Email Verification OTP Method

```typescript
/**
 * Send email verification OTP
 */
async sendEmailVerificationOTP(
  email: string,
  data: EmailVerificationOtpData,
): Promise<boolean> {
  const html = this.getEmailVerificationOtpHtml(data);

  return this.sendEmail({
    to: email,
    subject: 'Verify Your Email - Total Travel Solution Group',
    html,
  });
}
```

#### 5. Password Reset OTP HTML Template

```typescript
private getPasswordResetOtpHtml(data: PasswordResetOtpData): string {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Arial', 'Helvetica', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

              <!-- Header with Brand Color (Teal) -->
              <tr>
                <td style="background: linear-gradient(135deg, #0D9488 0%, #14B8A6 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                    Total Travel Solution Group
                  </h1>
                  <p style="color: #E0F2F1; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">
                    Hi ${data.firstName},
                  </h2>
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    We received a request to reset your password. Use the code below to reset your password:
                  </p>

                  <!-- OTP Code Box -->
                  <div style="background: linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%); border: 2px solid #0D9488; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                      Your Reset Code
                    </p>
                    <p style="color: #0D9488; font-size: 42px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${data.otp}
                    </p>
                    <p style="color: #64748b; font-size: 13px; margin: 10px 0 0 0;">
                      ⏰ This code expires in 15 minutes
                    </p>
                  </div>

                  <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 20px 0;">
                    If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
                  </p>

                  <!-- Security Notice -->
                  <div style="background-color: #FEF2F2; border-left: 4px solid #E11D48; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="color: #991B1B; font-size: 14px; margin: 0; line-height: 1.5;">
                      <strong>🔒 Security Tip:</strong> Never share this code with anyone. Our team will never ask for your verification code.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0;">
                    Need help? Contact us at:
                  </p>
                  <p style="margin: 5px 0;">
                    <a href="mailto:support@totaltravelsolutiongroup.com" style="color: #0D9488; text-decoration: none; font-size: 14px;">
                      support@totaltravelsolutiongroup.com
                    </a>
                  </p>
                  <p style="color: #64748b; font-size: 12px; margin: 20px 0 0 0; line-height: 1.5;">
                    © ${new Date().getFullYear()} Total Travel Solution Group. All rights reserved.<br>
                    Registered in England & Wales | Company Number: 16910276
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
```

#### 6. Email Verification OTP HTML Template

```typescript
private getEmailVerificationOtpHtml(data: EmailVerificationOtpData): string {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Arial', 'Helvetica', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

              <!-- Header with Brand Color (Teal) -->
              <tr>
                <td style="background: linear-gradient(135deg, #0D9488 0%, #14B8A6 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                    Total Travel Solution Group
                  </h1>
                  <p style="color: #E0F2F1; margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">
                    Hi ${data.firstName},
                  </h2>
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Thank you for registering with Total Travel Solution Group! Please verify your email address using the code below:
                  </p>

                  <!-- OTP Code Box -->
                  <div style="background: linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%); border: 2px solid #0D9488; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                      Your Verification Code
                    </p>
                    <p style="color: #0D9488; font-size: 42px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${data.otp}
                    </p>
                    <p style="color: #64748b; font-size: 13px; margin: 10px 0 0 0;">
                      ⏰ This code expires in 15 minutes
                    </p>
                  </div>

                  <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 20px 0;">
                    Once verified, you'll have full access to our airport transfer booking platform.
                  </p>

                  <!-- Security Notice -->
                  <div style="background-color: #FEF2F2; border-left: 4px solid #E11D48; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="color: #991B1B; font-size: 14px; margin: 0; line-height: 1.5;">
                      <strong>🔒 Security Tip:</strong> Never share this code with anyone. Our team will never ask for your verification code.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0;">
                    Need help? Contact us at:
                  </p>
                  <p style="margin: 5px 0;">
                    <a href="mailto:support@totaltravelsolutiongroup.com" style="color: #0D9488; text-decoration: none; font-size: 14px;">
                      support@totaltravelsolutiongroup.com
                    </a>
                  </p>
                  <p style="color: #64748b; font-size: 12px; margin: 20px 0 0 0; line-height: 1.5;">
                    © ${new Date().getFullYear()} Total Travel Solution Group. All rights reserved.<br>
                    Registered in England & Wales | Company Number: 16910276
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
```

---

## Frontend Implementation

### 1. API Functions

#### **File:** `/Users/macbookpro/Desktop/Traning/Next Js/tts-app/lib/api/auth.api.ts`

Add these functions to existing `auth.api.ts`:

```typescript
/**
 * Request password reset OTP
 * POST /auth/forgot-password
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Reset password with OTP
 * POST /auth/reset-password
 */
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

/**
 * Send email verification OTP
 * POST /auth/send-verification-otp
 */
export const sendVerificationOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>('/auth/send-verification-otp', { email });
  return response.data;
};

/**
 * Verify email with OTP
 * POST /auth/verify-email
 */
export const verifyEmail = async (
  email: string,
  otp: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>('/auth/verify-email', {
    email,
    otp,
  });
  return response.data;
};

/**
 * Resend OTP (password reset or email verification)
 * POST /auth/resend-otp
 */
export const resendOTP = async (
  email: string,
  type: 'PASSWORD_RESET' | 'EMAIL_VERIFICATION'
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>('/auth/resend-otp', {
    email,
    type,
  });
  return response.data;
};
```

---

### 2. Frontend Pages

#### **File:** `/Users/macbookpro/Desktop/Traning/Next Js/tts-app/app/forgot-password/page.tsx`

**URL:** `http://localhost:3000/forgot-password`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '@/lib/api/auth.api';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      toast.success(response.message);

      // Redirect to reset password page with email in query
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a verification code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </form>

        <div className="text-center">
          <a href="/login" className="text-sm text-teal-600 hover:text-teal-500">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

#### **File:** `/Users/macbookpro/Desktop/Traning/Next Js/tts-app/app/reset-password/page.tsx`

**URL:** `http://localhost:3000/reset-password`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword, resendOTP } from '@/lib/api/auth.api';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setResending(true);
    try {
      await resendOTP(email, 'PASSWORD_RESET');
      toast.success('OTP resent successfully');
      setCountdown(60); // 60 second cooldown
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword);
      toast.success('Password reset successfully');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
            />
            <div className="mt-2 text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-sm text-teal-600 hover:text-teal-500"
                >
                  {resending ? 'Sending...' : 'Resend code'}
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center">
          <a href="/login" className="text-sm text-teal-600 hover:text-teal-500">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

#### **File:** `/Users/macbookpro/Desktop/Traning/Next Js/tts-app/app/verify-email/page.tsx`

**URL:** `http://localhost:3000/verify-email`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail, resendOTP } from '@/lib/api/auth.api';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setResending(true);
    try {
      await resendOTP(email, 'EMAIL_VERIFICATION');
      toast.success('OTP resent successfully');
      setCountdown(60); // 60 second cooldown
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await verifyEmail(email, otp);
      toast.success('Email verified successfully!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
            />
            <div className="mt-2 text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-sm text-teal-600 hover:text-teal-500"
                >
                  {resending ? 'Sending...' : 'Resend code'}
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="text-center">
          <a href="/login" className="text-sm text-teal-600 hover:text-teal-500">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## Configuration Settings

### Environment Variables

#### Backend `.env` (Already Configured)

```bash
RESEND_API_KEY="re_FJDpe19y_QDsC9wvAZJZrRVnHmgzH1M9a"
FROM_EMAIL="no-reply@totaltravelsolutiongroup.com"
FRONTEND_URL="http://localhost:3000"
```

### OTP Settings (Hardcoded in Backend)

```typescript
OTP_LENGTH = 6 digits
OTP_EXPIRY = 15 minutes (900 seconds)
OTP_RESEND_COOLDOWN = 60 seconds
RATE_LIMIT = 3 requests per 5 minutes
```

---

## Step-by-Step Implementation Guide

### Phase 1: Database Setup ✅

1. **Update Prisma Schema**
   ```bash
   cd /Users/macbookpro/Desktop/Traning/Next\ Js/tts-api
   ```
   - Add `OtpToken` model to `prisma/schema.prisma`
   - Add `otpTokens` relation to `User` model

2. **Run Migration**
   ```bash
   npx prisma migrate dev --name add_otp_token_table
   npx prisma generate
   ```

### Phase 2: Backend Implementation ✅

3. **Create DTOs**
   - `src/auth/dto/forgot-password.dto.ts`
   - `src/auth/dto/reset-password.dto.ts`
   - `src/auth/dto/send-verification-otp.dto.ts`
   - `src/auth/dto/verify-email.dto.ts`
   - `src/auth/dto/resend-otp.dto.ts`

4. **Create OTP Service**
   - `src/auth/otp.service.ts`
   - Implement `generateOTP()`, `storeOTP()`, `validateOTP()`, `canRequestNewOTP()`

5. **Update Auth Service**
   - Add methods to `src/auth/auth.service.ts`:
     - `sendPasswordResetOTP()`
     - `resetPassword()`
     - `sendEmailVerificationOTP()`
     - `verifyEmail()`

6. **Update Auth Controller**
   - Add endpoints to `src/auth/auth.controller.ts`:
     - `POST /auth/forgot-password`
     - `POST /auth/reset-password`
     - `POST /auth/send-verification-otp`
     - `POST /auth/verify-email`
     - `POST /auth/resend-otp`

7. **Update Auth Module**
   - Add `OtpService` and `PrismaService` to providers in `src/auth/auth.module.ts`

8. **Add Email Templates**
   - Add interfaces to `src/integrations/resend/resend.service.ts`:
     - `PasswordResetOtpData`
     - `EmailVerificationOtpData`
   - Add methods:
     - `sendPasswordResetOTP()`
     - `sendEmailVerificationOTP()`
   - Add HTML templates:
     - `getPasswordResetOtpHtml()`
     - `getEmailVerificationOtpHtml()`

### Phase 3: Frontend Implementation ✅

9. **Add API Functions**
   - Update `/Users/macbookpro/Desktop/Traning/Next Js/tts-app/lib/api/auth.api.ts`
   - Add:
     - `forgotPassword()`
     - `resetPassword()`
     - `sendVerificationOTP()`
     - `verifyEmail()`
     - `resendOTP()`

10. **Create Frontend Pages**
    - `/Users/macbookpro/Desktop/Traning/Next Js/tts-app/app/forgot-password/page.tsx`
    - `/Users/macbookpro/Desktop/Traning/Next Js/tts-app/app/reset-password/page.tsx`
    - `/Users/macbookpro/Desktop/Traning/Next Js/tts-app/app/verify-email/page.tsx`

11. **Update Login/Register Pages**
    - Add "Forgot Password?" link on login page
    - Add "Verify Email" prompt after registration

### Phase 4: Testing ✅

12. **Test Forgot Password Flow**
    - Navigate to `/forgot-password`
    - Enter email → receive OTP
    - Navigate to `/reset-password`
    - Enter OTP + new password → password reset

13. **Test Email Verification Flow**
    - Register new account
    - Navigate to `/verify-email`
    - Enter OTP → email verified

14. **Test OTP Expiry**
    - Wait 15+ minutes after receiving OTP
    - Try to use expired OTP → should fail

15. **Test Resend Cooldown**
    - Request OTP
    - Try to resend immediately → should fail
    - Wait 60 seconds → resend should work

---

## Testing Checklist

### Forgot Password Flow

- [ ] User can request password reset OTP
- [ ] OTP email is received (check spam)
- [ ] OTP is 6 digits
- [ ] OTP expires after 15 minutes
- [ ] Expired OTP cannot be used
- [ ] Used OTP cannot be reused
- [ ] User can reset password with valid OTP
- [ ] Password strength validation works
- [ ] User can resend OTP after 60 seconds
- [ ] Resend before cooldown shows error
- [ ] Rate limiting works (3 requests per 5 minutes)

### Email Verification Flow

- [ ] Verification OTP is sent after registration
- [ ] Verification email is received
- [ ] User can verify email with valid OTP
- [ ] `isEmailVerified` is set to `true` in database
- [ ] Already verified email shows error
- [ ] User can resend verification OTP
- [ ] Expired OTP cannot be used
- [ ] Rate limiting works

### Email Templates

- [ ] Emails use branded Teal colors (#0D9488)
- [ ] OTP code is clearly displayed
- [ ] Expiry time (15 minutes) is mentioned
- [ ] Security warning is included
- [ ] Company details are in footer
- [ ] Support email is clickable
- [ ] Mobile responsive design

### Security

- [ ] OTPs are unique
- [ ] Old OTPs are invalidated when new one is requested
- [ ] OTPs expire after 15 minutes
- [ ] Used OTPs cannot be reused
- [ ] Rate limiting prevents abuse
- [ ] 60-second cooldown between resends
- [ ] Invalid email shows appropriate error

---

## Security Considerations

### 1. OTP Security

- **Random Generation:** Use `Math.random()` for 6-digit codes
- **Single Use:** Mark OTP as `used = true` after validation
- **Expiry:** OTPs expire after 15 minutes
- **Invalidation:** Old OTPs are invalidated when new one is requested

### 2. Rate Limiting

- **Throttle Decorator:** NestJS throttler prevents abuse
- **Forgot Password:** 3 requests per 5 minutes
- **Reset Password:** 5 requests per 5 minutes
- **Resend OTP:** 60-second cooldown between requests

### 3. Password Security

- **Minimum Length:** 8 characters
- **Complexity:** Must contain uppercase, lowercase, and number
- **Hashing:** Bcrypt with salt rounds = 10
- **No Password in Logs:** Never log passwords or OTPs

### 4. Email Security

- **Verified Sender:** Using verified domain `totaltravelsolutiongroup.com`
- **No Sensitive Data:** Only OTP code in email (no password)
- **Clear Instructions:** Users know email is legitimate

### 5. Database Security

- **Cascade Delete:** OTP tokens deleted when user is deleted
- **Indexes:** Efficient lookups on `email` and `type`
- **Cleanup:** Expired OTPs should be periodically deleted (optional cron job)

---

## Future Enhancements (Optional)

1. **Max OTP Attempts**
   - Lock account after 5 failed OTP attempts
   - Require manual unlock or time-based unlock

2. **SMS OTP (Alternative)**
   - Use Twilio to send OTP via SMS
   - Allow user to choose email or SMS

3. **2FA (Two-Factor Authentication)**
   - Optional 2FA for enhanced security
   - Use TOTP (Time-based One-Time Password) apps

4. **Email Verification Reminder**
   - Send reminder email if user hasn't verified within 24 hours
   - Show banner on dashboard for unverified users

5. **Password History**
   - Prevent users from reusing last 3 passwords
   - Store hashed previous passwords

6. **Login History**
   - Track login attempts (IP, device, location)
   - Notify user of suspicious login activity

---

## Troubleshooting

### OTP Not Received

1. Check spam/junk folder
2. Verify Resend API key is correct
3. Check domain verification on Resend dashboard
4. Review backend logs for email errors
5. Test email with `test-email.js` script

### OTP Validation Fails

1. Check if OTP has expired (15 minutes)
2. Verify OTP hasn't been used already
3. Check database for matching OTP token
4. Review backend logs for validation errors

### Rate Limiting Issues

1. Check throttle decorator configuration
2. Verify rate limits in controller
3. Clear throttler cache if needed
4. Adjust limits for development/testing

### Frontend Errors

1. Check API endpoint URLs match backend
2. Verify CORS is configured correctly
3. Check browser console for errors
4. Test API endpoints with Postman/Insomnia

---

## Documentation Maintenance

**Last Updated:** January 25, 2026
**Version:** 1.0
**Status:** Ready for Implementation

**Next Steps:**
1. Review this document in next session
2. Start with Phase 1: Database Setup
3. Implement backend first, then frontend
4. Test each phase thoroughly before moving forward

---

**Repository Paths:**
- **Backend:** `/Users/macbookpro/Desktop/Traning/Next Js/tts-api`
- **Frontend:** `/Users/macbookpro/Desktop/Traning/Next Js/tts-app`
- **This Document:** `/Users/macbookpro/Desktop/Traning/Next Js/tts-api/FORGOT_PASSWORD_EMAIL_VERIFICATION_IMPLEMENTATION.md`

---

✅ **Document Complete - Ready for Implementation**
