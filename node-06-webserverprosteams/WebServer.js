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

function fileAccess(filepath) {
    return new Promise((resolve, reject) => {
        fs.access(filepath, fs.F_OK, error => {
            if (!error) {
                resolve(filepath);
            } else {
                reject(error);
            }
        });
    });
}

function fileReader(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (error, content) => {
            if (!error) {
                resolve(content);
            } else {
                reject(error);
            }
        });
    });
}

function webserver(req, res) {

    let baseURI = url.parse(req.url);
    let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
    let contentType = mimes[path.extname(filepath)];

    fileAccess(filepath)
        .then(fileReader)
        .then(content => {
            res.writeHead(200, { 'Content-type': contentType });
            res.end(content, 'utf-8');
        })
        .catch(error => {
            console.log(error);
            res.writeHead(404);
            res.end(JSON.stringify(error));
        });

}

http.createServer(webserver).listen(3000, () => {
    console.log('Webserver running on port 3000')
});