const express = require('express');
const http = require('http');
const url = require('url');

const app = express();

app.use('/:agentName/prompt', (req, res) => {
    const { agentName, action } = req.params;
    console.log(agentName);
    const targetUrl = 'http://' + agentName + `/${action}'`;
    const parsedUrl = url.parse(targetUrl);
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.path, // Forward the original URL path
        method: req.method,
        headers: req.headers,
    };
    const proxyRequest = http.request(options, (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.pipe(res);
    });
    req.pipe(proxyRequest);
    proxyRequest.on('error', (err) => {
        console.error('Proxy request error:', err);
        res.status(500).send('Internal Server Error');
    });
});



app.use('/:agentName/ping', (req, res) => {
    const { agentName, action } = req.params;
    console.log(agentName);
    const targetUrl = 'http://' + agentName + `/${action}'`;
    const parsedUrl = url.parse(targetUrl);
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.path, // Forward the original URL path
        method: req.method,
        headers: req.headers,
    };
    const proxyRequest = http.request(options, (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.pipe(res);
    });
    req.pipe(proxyRequest);
    proxyRequest.on('error', (err) => {
        console.error('Proxy request error:', err);
        res.status(500).send('Internal Server Error');
    });
});

app.listen(80, '0.0.0.0', () => {
    console.log('Proxy server running on http://localhost:80');
});
