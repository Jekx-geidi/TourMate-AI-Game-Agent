import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Local development falls back to a bundled SQLite file. In any deployed
// environment DATABASE_URL must be provided (a Postgres connection string).
process.env.DATABASE_URL ??= 'file:./dev.db';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Prisma');

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to connect to the database. DATABASE_URL is ${
          process.env.DATABASE_URL ? 'set' : 'NOT set'
        }. ${message}`,
      );
      throw error;
    }
  }
}
