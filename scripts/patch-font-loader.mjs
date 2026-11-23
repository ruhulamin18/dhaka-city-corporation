import fs from 'node:fs';
import path from 'node:path';

/**
 * Next.js 15 Google Font Loader Patch
 *
 * Fixes upstream TypeError: Cannot read properties of null (reading '1')
 * when Google Fonts returns kit URLs (e.g., https://fonts.gstatic.com/l/font?kit=...&skey=...&v=...)
 * which do not end with a file extension.
 */
const file = path.resolve('node_modules/next/dist/compiled/@next/font/dist/google/loader.js');

try {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    const target = 'const ext = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1];';

    if (code.includes(target)) {
      const replacement = `const match = /\\.(woff|woff2|eot|ttf|otf)/i.exec(googleFontFileUrl);
            const ext = match ? match[1] : 'woff2';`;
      code = code.replace(target, replacement);
      fs.writeFileSync(file, code, 'utf8');
    }
  }
} catch {
  // Graceful fallback
}
