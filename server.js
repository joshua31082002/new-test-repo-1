const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || 4173);
const root = __dirname;

const server = http.createServer((request, response) => {
  const requestPath = request.url === '/' ? '/index.html' : request.url;
  const filePath = path.resolve(root, `.${requestPath}`);

  if (!filePath.startsWith(root + path.sep)) {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500, {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }

    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(content);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Hello world app listening on port ${port}`);
});
