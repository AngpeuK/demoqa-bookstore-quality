import { expect, test } from '@playwright/test';
import { AccountClient } from '../../src/api/account.client.js';

test.describe('DevSecOps — passive and low-impact security contracts', () => {
  test('@security SEC-001 API suppresses implementation fingerprint headers', async ({
    request,
  }) => {
    test.fail(true, 'Known defect DEF-004: API discloses Express and nginx versions');
    const response = await request.get('/BookStore/v1/Books');
    expect(response.headers()).not.toHaveProperty('x-powered-by');
    expect(response.headers().server).not.toMatch(/nginx\/[\d.]+/i);
  });

  test('@security SEC-002 UI returns baseline browser security headers', async ({ request }) => {
    test.fail(true, 'Known defect DEF-004: CSP, HSTS and nosniff headers are absent');
    const response = await request.get('/books');
    expect(response.headers()['strict-transport-security']).toBeTruthy();
    expect(response.headers()['content-security-policy']).toBeTruthy();
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
  });

  test('@security SEC-003 preflight does not trust an arbitrary origin', async ({ request }) => {
    const response = await request.fetch('/BookStore/v1/Books', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://untrusted.invalid',
        'Access-Control-Request-Method': 'GET',
      },
    });
    expect(response.headers()['access-control-allow-origin']).not.toBe('*');
    expect(response.headers()['access-control-allow-credentials']).not.toBe('true');
  });

  test('@security SEC-004 authorization errors never echo the supplied token', async ({
    request,
  }) => {
    const canary = 'security-canary-token-never-reflect';
    const response = await new AccountClient(request).getUser(
      '00000000-0000-0000-0000-000000000000',
      canary,
    );
    expect(response.status()).toBe(401);
    expect(await response.text()).not.toContain(canary);
  });

  test('@security SEC-005 ISBN injection-like input is handled as data', async ({ request }) => {
    const response = await request.get('/BookStore/v1/Book', {
      params: { ISBN: "' OR '1'='1" },
    });
    expect(response.status()).toBe(400);
    const body = await response.text();
    expect(body).not.toMatch(/sequelize|sql syntax|stack trace/i);
  });

  test('@security SEC-006 unsupported methods fail without a server error', async ({ request }) => {
    test.fail(true, 'Known defect DEF-005: unsupported PATCH returns a misleading HTTP 200');
    const response = await request.patch('/BookStore/v1/Books', { data: {} });
    expect([404, 405]).toContain(response.status());
    expect(response.status()).toBeLessThan(500);
  });

  test('@security SEC-007 plain HTTP redirects to HTTPS', async ({ playwright }) => {
    const context = await playwright.request.newContext({
      baseURL: 'http://demoqa.com',
      maxRedirects: 0,
    });
    try {
      const response = await context.get('/books');
      expect([301, 302, 307, 308]).toContain(response.status());
      expect(response.headers().location).toMatch(/^https:\/\//);
    } finally {
      await context.dispose();
    }
  });
});
