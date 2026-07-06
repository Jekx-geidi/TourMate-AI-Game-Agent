import { getAllowedOrigins } from './cors';

describe('getAllowedOrigins', () => {
  it('includes the frontend URL and any comma-separated overrides', () => {
    const origins = getAllowedOrigins({
      FRONTEND_URL: 'https://frontend.example.com',
      CORS_ORIGINS: 'https://one.example.com, https://two.example.com',
    } as NodeJS.ProcessEnv);

    expect(origins).toEqual(
      expect.arrayContaining([
        'https://frontend.example.com',
        'https://one.example.com',
        'https://two.example.com',
      ]),
    );
  });

  it('falls back to localhost origins when no frontend URL is provided', () => {
    const origins = getAllowedOrigins({} as NodeJS.ProcessEnv);

    expect(origins).toEqual(
      expect.arrayContaining([
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
      ]),
    );
  });
});
