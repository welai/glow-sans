const path = require('path');
const connect = require('connect');
const serveStatic = require('serve-static');
const port = 8080;

connect()
  .use(serveStatic(path.join(__dirname, '..'), { maxAge: '0' }))
  .listen(port, () => console.log(`Server running on ${port}...`));