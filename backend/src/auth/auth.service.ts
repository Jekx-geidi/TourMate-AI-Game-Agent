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
import { randomBytes, randomInt } from 'crypto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RequestRegisterCodeDto } from './dto/request-register-code.dto';
import { RegisterDto } from './dto/register.dto';
import { SupabaseAuthDto } from './dto/supabase-auth.dto';
import { SupabaseRegisterDto } from './dto/supabase-register.dto';

@Injectable()
export class AuthService {
  private static readonly REGISTER_PURPOSE = 'register';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async requestRegisterCode(dto: RequestRegisterCodeDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException(
        'An account with this email already exists.',
      );
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const codeHash = await bcrypt.hash(code, 10);
    const ttlMinutes = Number(
      this.configService.get<string>('EMAIL_VERIFICATION_CODE_TTL_MINUTES') ?? '10',
    );

    await this.prisma.emailVerificationCode.upsert({
      where: { email_purpose: { email, purpose: AuthService.REGISTER_PURPOSE } },
      update: { codeHash, expiresAt: new Date(Date.now() + ttlMinutes * 60_000) },
      create: {
        email,
        purpose: AuthService.REGISTER_PURPOSE,
        codeHash,
        expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
      },
    });

    await this.mailService.sendVerificationCode(email, code);

    return { message: `A verification code was sent to ${email}.` };
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
      where: { email_purpose: { email, purpose: AuthService.REGISTER_PURPOSE } },
    });

    if (!verification || verification.expiresAt < new Date()) {
      throw new BadRequestException(
        'This verification code has expired. Please request a new one.',
      );
    }

    const codeMatches = await bcrypt.compare(dto.code, verification.codeHash);
    if (!codeMatches) {
      throw new BadRequestException('That verification code is not correct.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      name: dto.name,
      email,
      password: hashedPassword,
    });

    await this.prisma.emailVerificationCode.delete({ where: { id: verification.id } });

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

  // For OAuth providers (Google, etc.) via Supabase: unlike email/password,
  // there is no separate "register" step the user goes through first, so
  // this finds an existing account by email or creates one transparently.
  async continueWithSupabase(dto: SupabaseAuthDto) {
    const supabaseUser = await this.getVerifiedSupabaseUser(dto.accessToken);
    const email = supabaseUser.email?.trim().toLowerCase();

    if (!email) {
      throw new UnauthorizedException(
        'The verified Supabase user does not have an email address.',
      );
    }

    const googleName = String(
      supabaseUser.user_metadata?.full_name ??
        supabaseUser.user_metadata?.name ??
        '',
    ).trim();
    const googleAvatarUrl = String(
      supabaseUser.user_metadata?.avatar_url ?? '',
    ).trim();

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      // Refresh from the verified Google profile on every sign-in, not just
      // the first one -- catches a changed photo or display name.
      const synced = await this.usersService.syncFromGoogleProfile(
        existingUser.id,
        { name: googleName, avatarUrl: googleAvatarUrl },
      );
      return this.buildAuthResponse(synced ?? existingUser);
    }

    const name = googleName || email.split('@')[0];
    const generatedPassword = randomBytes(24).toString('hex');
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    const withAvatar = googleAvatarUrl
      ? await this.usersService.syncFromGoogleProfile(user.id, {
          avatarUrl: googleAvatarUrl,
        })
      : user;

    return this.buildAuthResponse(withAvatar ?? user);
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
    avatarUrl?: string | null;
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
        avatarUrl: user.avatarUrl ?? null,
      },
    };
  }

  private async getVerifiedSupabaseUser(
    accessToken: string,
  ): Promise<SupabaseUser> {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

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
}
