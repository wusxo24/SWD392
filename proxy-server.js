// filepath: d:\hukoFpt\SWD392\proxy-server.js
const cors_proxy = require('cors-anywhere');

const host = 'localhost';
const port = 8080;

cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
  setHeaders: {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control'
  }
}).listen(port, host, () => {
  console.log(`Running CORS Anywhere on ${host}:${port}`);
});