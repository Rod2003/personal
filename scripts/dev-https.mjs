import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:https';
import { join } from 'node:path';
import { parse } from 'node:url';
import next from 'next';

const port = Number(process.env.PORT || 3000);
const certificateDirectory = join(process.cwd(), '.cert');
const keyPath = join(certificateDirectory, 'localhost-key.pem');
const certificatePath = join(certificateDirectory, 'localhost.pem');

if (!existsSync(keyPath) || !existsSync(certificatePath)) {
  mkdirSync(certificateDirectory, { recursive: true });
  execFileSync('openssl', [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-sha256',
    '-days',
    '3650',
    '-subj',
    '/CN=localhost',
    '-addext',
    'subjectAltName=DNS:localhost,IP:127.0.0.1',
    '-keyout',
    keyPath,
    '-out',
    certificatePath,
  ]);
}

const app = next({ dev: true });
const handle = app.getRequestHandler();

await app.prepare();

createServer(
  {
    key: readFileSync(keyPath),
    cert: readFileSync(certificatePath),
  },
  (request, response) => handle(request, response, parse(request.url, true)),
).listen(port, '0.0.0.0', () => {
  console.log(`ready - started server at https://localhost:${port}`);
});
