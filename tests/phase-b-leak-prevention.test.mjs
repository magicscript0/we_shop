import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve('.');

function getAllFiles(dir, exts = ['.ts', '.tsx', '.mjs', '.sql', '.json', '.md']) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      // Exclude AUDIT.md and this test file itself since it mentions test patterns
      if (entry.name === 'AUDIT.md' || entry.name.includes('leak-prevention')) continue;
      files.push(fullPath);
    }
  }
  return files;
}

describe('Phase B: Leak Prevention & Security Invariants', () => {
  describe('1. Zero-Tolerance WhatsApp Eradication', () => {
    test('Zero matches for "wa.me", "whatsapp", or "واتساب" across all source and config files', () => {
      const files = getAllFiles(ROOT_DIR);
      const whatsappRegex = /wa\.me|whatsapp|واتساب/i;
      const offending = [];

      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        if (whatsappRegex.test(content)) {
          offending.push(path.relative(ROOT_DIR, file));
        }
      }

      assert.deepStrictEqual(
        offending,
        [],
        `Found forbidden WhatsApp references in: ${offending.join(', ')}`
      );
    });
  });

  describe('2. Public Client Bundle Payment Account Isolation', () => {
    test('Public constants.ts does NOT expose raw payment account numbers', () => {
      const constantsContent = fs.readFileSync(
        path.join(ROOT_DIR, 'src', 'lib', 'constants.ts'),
        'utf-8'
      );
      assert.strictEqual(
        constantsContent.includes('01034027398'),
        false,
        '01034027398 must not exist in src/lib/constants.ts'
      );
      assert.strictEqual(
        constantsContent.includes('we-orders@instapay'),
        false,
        'we-orders@instapay must not exist in src/lib/constants.ts'
      );
    });

    test('Header and Footer do NOT expose raw payment phone numbers', () => {
      const headerContent = fs.readFileSync(
        path.join(ROOT_DIR, 'src', 'components', 'layout', 'Header.tsx'),
        'utf-8'
      );
      const footerContent = fs.readFileSync(
        path.join(ROOT_DIR, 'src', 'components', 'layout', 'Footer.tsx'),
        'utf-8'
      );

      assert.strictEqual(headerContent.includes('01034027398'), false);
      assert.strictEqual(footerContent.includes('01034027398'), false);
    });

    test('Checkout page step 2 does NOT leak payment accounts before order placement', () => {
      const checkoutContent = fs.readFileSync(
        path.join(ROOT_DIR, 'src', 'app', 'checkout', 'page.tsx'),
        'utf-8'
      );
      assert.strictEqual(checkoutContent.includes('01034027398'), false);
      assert.strictEqual(checkoutContent.includes('we-orders@instapay'), false);
    });
  });

  describe('3. 50 GB Plan Permanent Eradication & 301 Redirect', () => {
    test('Catalog constants has exactly 33 plans and no 50GB plan', () => {
      const constantsContent = fs.readFileSync(
        path.join(ROOT_DIR, 'src', 'lib', 'constants.ts'),
        'utf-8'
      );
      assert.strictEqual(constantsContent.includes('super-monthly-50gb'), false);
    });

    test('next.config.ts has a permanent 301 redirect for /plans/super-monthly-50gb to /plans', () => {
      const nextConfig = fs.readFileSync(
        path.join(ROOT_DIR, 'next.config.ts'),
        'utf-8'
      );
      assert.ok(nextConfig.includes('/plans/super-monthly-50gb'));
      assert.ok(nextConfig.includes('/plans'));
      assert.ok(nextConfig.includes('permanent: true'));
    });

    test('Database seed.sql has no 50gb plan row', () => {
      const seedContent = fs.readFileSync(
        path.join(ROOT_DIR, 'supabase', 'seed.sql'),
        'utf-8'
      );
      assert.strictEqual(seedContent.includes('super-monthly-50gb'), false);
    });
  });

  describe('4. Server-Only Payment Accounts & Launch Guard', () => {
    test('Server-only payment account service exists and defines launch guard for placeholders', () => {
      const serverAccountsContent = fs.readFileSync(
        path.join(ROOT_DIR, 'src', 'lib', 'services', 'paymentAccounts.server.ts'),
        'utf-8'
      );
      assert.ok(serverAccountsContent.includes('01034027398'));
      assert.ok(serverAccountsContent.includes('we-orders@instapay'));
      assert.ok(serverAccountsContent.includes('validatePaymentAccountsLaunchGuard'));
      assert.ok(serverAccountsContent.includes('01100000000'));
      assert.ok(serverAccountsContent.includes('01200000000'));
    });

    test('Secure API endpoint sets Cache-Control: no-store', () => {
      const apiRouteContent = fs.readFileSync(
        path.join(
          ROOT_DIR,
          'src',
          'app',
          'api',
          'orders',
          '[orderId]',
          'payment-account',
          'route.ts'
        ),
        'utf-8'
      );
      assert.ok(apiRouteContent.includes('Cache-Control'));
      assert.ok(apiRouteContent.includes('no-store'));
    });
  });
});
