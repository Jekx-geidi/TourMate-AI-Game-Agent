import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createClient, type User as SupabaseUser } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, randomInt } from 'crypto';
import nodemailer from 'nodemailer';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RequestRegisterCodeDto } from './dto/request-register-code.dto';
import { RegisterDto } from './dto/register.dto';
import { SupabaseAuthDto } from './dto/supabase-auth.dto';
import { SupabaseRegisterDto } from './dto/supabase-register.dto';

@Injectable()
export class AuthService {
  private static readonly REGISTER_CODE_PURPOSE = 'register';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async requestRegisterCode(dto: RequestRegisterCodeDto) {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException(
        'An account with this email already exists.',
      );
    }

    const code = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(
      Date.now() + this.getVerificationTtlMinutes() * 60 * 1000,
    );

    await this.prisma.emailVerificationCode.upsert({
      where: {
        email_purpose: {
          email,
          purpose: AuthService.REGISTER_CODE_PURPOSE,
        },
      },
      create: {
        email,
        purpose: AuthService.REGISTER_CODE_PURPOSE,
        codeHash: this.hashVerificationCode(email, code),
        expiresAt,
      },
      update: {
        codeHash: this.hashVerificationCode(email, code),
        expiresAt,
      },
    });

    await this.sendVerificationEmail(email, code, expiresAt);

    return {
      message: `A verification code has been sent to ${email}.`,
      expiresInMinutes: this.getVerificationTtlMinutes(),
    };
  }

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException(
        'An account with this email already exists.',
      );
    }

    const verification = await this.prisma.emailVerificationCode.findUnique({
      where: {
        email_purpose: {
          email,
          purpose: AuthService.REGISTER_CODE_PURPOSE,
        },
      },
    });

    if (!verification) {
      throw new BadRequestException(
        'Request a verification code first before creating your account.',
      );
    }

    if (verification.expiresAt.getTime() < Date.now()) {
      await this.prisma.emailVerificationCode.delete({
        where: {
          email_purpose: {
            email,
            purpose: AuthService.REGISTER_CODE_PURPOSE,
          },
        },
      });
      throw new BadRequestException(
        'Your verification code has expired. Request a new one.',
      );
    }

    const providedCodeHash = this.hashVerificationCode(
      email,
      dto.verificationCode.trim(),
    );

    if (providedCodeHash !== verification.codeHash) {
      throw new BadRequestException('The verification code is not correct.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      name: dto.name,
      email,
      password: hashedPassword,
    });

    await this.prisma.emailVerificationCode.delete({
      where: {
        email_purpose: {
          email,
          purpose: AuthService.REGISTER_CODE_PURPOSE,
        },
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(
      dto.email.trim().toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException('We could not find that account.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('The password is not correct.');
    }

    return this.buildAuthResponse(user);
  }

  async loginWithSupabase(dto: SupabaseAuthDto) {
    const supabaseUser = await this.getVerifiedSupabaseUser(dto.accessToken);
    const email = supabaseUser.email?.trim().toLowerCase();

    if (!email) {
      throw new UnauthorizedException(
        'The verified Supabase user does not have an email address.',
      );
    }

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'No TourMate account exists for this email yet. Create an account first.',
      );
    }

    return this.buildAuthResponse(user);
  }

  async registerWithSupabase(dto: SupabaseRegisterDto) {
    const supabaseUser = await this.getVerifiedSupabaseUser(dto.accessToken);
    const email = supabaseUser.email?.trim().toLowerCase();

    if (!email) {
      throw new UnauthorizedException(
        'The verified Supabase user does not have an email address.',
      );
    }

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException(
        'An account with this email already exists. Use email login instead.',
      );
    }

    const name =
      dto.name.trim() ||
      String(supabaseUser.user_metadata?.name ?? '').trim() ||
      email.split('@')[0];
    const generatedPassword = randomBytes(24).toString('hex');
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.buildAuthResponse(user);
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Please log in again to continue.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  private buildAuthResponse(user: {
    id: string;
    email: string;
    name: string;
    password: string;
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private async getVerifiedSupabaseUser(
    accessToken: string,
  ): Promise<SupabaseUser> {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey =
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new ServiceUnavailableException(
        'Supabase auth is not configured yet.',
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedException(
        error?.message ?? 'The Supabase access token is invalid.',
      );
    }

    return data.user;
  }

  private getVerificationTtlMinutes() {
    return Math.max(
      1,
      Number(this.configService.get<string>('EMAIL_VERIFICATION_CODE_TTL_MINUTES') ?? '10'),
    );
  }

  private hashVerificationCode(email: string, code: string) {
    return createHash('sha256')
      .update(`${email}:${code}`)
      .digest('hex');
  }

  private async sendVerificationEmail(
    email: string,
    code: string,
    expiresAt: Date,
  ) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') ?? '587');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const from =
      this.configService.get<string>('SMTP_FROM') ??
      'TourMate AI <no-reply@tourmate.local>';

    if (!host || Number.isNaN(port)) {
      throw new ServiceUnavailableException(
        'Email verification is not configured yet. Add SMTP settings first.',
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure:
        (this.configService.get<string>('SMTP_SECURE') ?? 'false') === 'true',
      auth: user || pass ? { user: user ?? '', pass: pass ?? '' } : undefined,
    });

    const expiresAtText = expiresAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: 'Your TourMate AI verification code',
      text: `Your TourMate AI verification code is ${code}. It expires at ${expiresAtText}.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
          <h2 style="margin-bottom: 12px;">TourMate AI verification</h2>
          <p>Use this code to finish creating your account:</p>
          <p style="font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #7c3aed; margin: 20px 0;">
            ${code}
          </p>
          <p>This code expires at ${expiresAtText}.</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `,
    });
  }
}
