import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient, type User as SupabaseUser } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RequestRegisterCodeDto } from './dto/request-register-code.dto';
import { RegisterDto } from './dto/register.dto';
import { SupabaseAuthDto } from './dto/supabase-auth.dto';
import { SupabaseRegisterDto } from './dto/supabase-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async requestRegisterCode(_dto: RequestRegisterCodeDto) {
    throw new ServiceUnavailableException(
      'Email verification is currently disabled. Create your account with email and password instead.',
    );
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

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      name: dto.name,
      email,
      password: hashedPassword,
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
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

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
