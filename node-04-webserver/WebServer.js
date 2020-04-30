'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs'); // read write files
const path = require('path');

let mimes = {
    '.htm': 'text/html',
    '.css': 'text/css',
    '.gif': 'image/gif',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
}

function webserver(req, res) {
    // if the route requested is '/', then load 'index.htm' or else
    // load the requested file(s)

    let baseURI = url.parse(req.url);
    // __dirname => getting the current directory (local to each module)
    let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
    console.log("Requesting: ", filepath);
    // Check if file is accesible or not
    fs.access(filepath, fs.F_OK, error => {
        if (!error) {
            // Read and serve
            fs.readFile(filepath, (error, content) => {
                if (!error) {
                    console.log("Serving: ", filepath);
                    // Resolve the content type
                    let contentType = mimes[path.extname(filepath)]; // mimes['.css'] === 'text/css'
                    // Serve the file from the buffer
                    res.writeHead(200, { 'Content-type': contentType });
                    res.end(content, 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end('The server could not read the file requested.');
                }
            });
        } else {
            console.log(error);
            res.writeHead(404);
            res.end('Content not found');
        }
    }); // F_OK, R_OK, W_OK, X_OK
}

http.createServer(webserver).listen(3000, () => {
    console.log('Webserver running on port 3000')
});