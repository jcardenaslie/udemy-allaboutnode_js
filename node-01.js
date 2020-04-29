'use strict';
const http = require('http');
const url = require('url');

let routes = {
    'GET': {
        '/': (req, res) => {
            res.writeHead(200, { 'Contet-type': 'text/html' });
            res.end('<h1>Hello Router </h1>');
        },
        '/about': (req, res) => {
            res.writeHead(200, { 'Contet-type': 'text/html' });
            res.end('<h1>This is the about page </h1>');
        },
        '/api/getinfo': (req, res) => {
            // Fetch data from db
            res.writeHead(200, { 'Contet-type': 'application/json' });
            res.end(JSON.stringify(req.queryParams));
        }
    },
    'POST': {},
    'NA': (req, res) => {
        res.writeHead(404);
        res.end('Content not found');
    }
};

function router(req, res) {

    let baseURI = url.parse(req.url, true);

    console.log('Requested route: ', baseURI);
    console.log('Requested method: ', req.method);

    let resolveRoute = routes[req.method][baseURI.pathname];

    if (resolveRoute != undefined) {
        req.queryParams = baseURI.query;
        resolveRoute(req, res);
    } else {
        routes['NA'](req, res);
    }

}

http.createServer(router).listen(3000, () => {
    console.log('Server running on the port 3000')
});