const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || 4173);
const publicDirectory = path.join(__dirname, 'public');
const contentTypes = {
  '/': 'text/html; charset=utf-8',
  '/index.html': 'text/html; charset=utf-8',
  '/styles.css': 'text/css; charset=utf-8',
};

const server = http.createServer((request, response) => {
  const requestPath = request.url === '/' ? '/index.html' : request.url;
  const fileName = requestPath.split('?')[0];
  const filePath = path.join(publicDirectory, fileName);

  if (!contentTypes[fileName]) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Internal server error');
      return;
    }

    response.writeHead(200, { 'Content-Type': contentTypes[fileName] });
    response.end(content);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Hello World page listening on port ${port}`);
});
