import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { verificationEmailHtml } from './verification-email.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<string>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: this.configService.get<string>('SMTP_SECURE') === 'true',
        auth: { user, pass },
      });
    } else {
      this.logger.warn('SMTP is not configured -- email sending is disabled.');
    }
  }

  async sendVerificationCode(email: string, code: string) {
    if (!this.transporter) {
      throw new ServiceUnavailableException(
        'Email sending is not configured yet. Please try again later.',
      );
    }

    const ttlMinutes = Number(
      this.configService.get<string>('EMAIL_VERIFICATION_CODE_TTL_MINUTES') ?? '10',
    );
    const from = this.configService.get<string>('SMTP_FROM') ?? 'TourMate AI';

    await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Your TourMate AI verification code',
      html: verificationEmailHtml(code, ttlMinutes),
    });
  }
}
