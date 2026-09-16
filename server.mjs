import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = resolve(fileURLToPath(new URL('.', import.meta.url)));
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
};

function getPort() {
  const portIndex = process.argv.indexOf('--port');
  const port = Number(portIndex === -1 ? 4173 : process.argv[portIndex + 1]);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Port must be an integer between 1 and 65535.');
  }

  return port;
}

function getHost() {
  const hostIndex = process.argv.indexOf('--host');
  return hostIndex === -1 ? '0.0.0.0' : process.argv[hostIndex + 1];
}

function getSafePath(requestPath) {
  const decodedPath = decodeURIComponent(requestPath);
  const requestedPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const absolutePath = resolve(join(rootDirectory, requestedPath));
  const pathWithinRoot = relative(rootDirectory, absolutePath);

  if (pathWithinRoot.startsWith('..') || pathWithinRoot.includes(`..${'/'}`)) {
    return null;
  }

  return absolutePath;
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method Not Allowed');
    return;
  }

  try {
    const requestUrl = new URL(request.url ?? '/', 'http://localhost');
    const filePath = getSafePath(normalize(requestUrl.pathname));

    if (!filePath) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      response.writeHead(404);
      response.end('Not Found');
      return;
    }

    const contentType = contentTypes[extname(filePath)] ?? 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': contentType });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch (error) {
    if (error.code === 'ENOENT') {
      response.writeHead(404);
      response.end('Not Found');
      return;
    }

    console.error(error);
    response.writeHead(500);
    response.end('Internal Server Error');
  }
});

const host = getHost();
const port = getPort();
server.listen(port, host, () => {
  console.log(`Static preview server listening on http://${host}:${port}`);
});
