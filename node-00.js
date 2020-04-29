'use strict';
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, { 'Contet-type': 'text/html' });
    res.end('<h1>Hello Server </h1>');
}).listen(3000, () => console.log('Server running on the port 3000'));