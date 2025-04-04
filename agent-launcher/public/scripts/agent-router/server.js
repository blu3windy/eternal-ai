const express = require('express');
const http = require('http');
const url = require('url');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

const REQUEST_TIMEOUT = 30; // 30 minutes
const FILE_RETENTION_HOURS = 72; // 72 hours

// Enable CORS for all origins
app.use(
   cors({
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
      credentials: true,
   })
);

// Add body parser middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.options('*', cors()); // Enable preflight for all routes

const tryToParseStringJson = (data) => {
   try {
      return JSON.parse(data);
   } catch (error) {
      return data;
   }
};


const isStreamingResponse = (headers) => {
   return headers['content-type']?.includes('text/event-stream') || 
          headers['content-type']?.includes('application/x-ndjson') ||
          headers['transfer-encoding']?.includes('chunked');
 };

const normalizeResponse = (id, data, agentName) => {
   if (typeof data === 'string') {
      return {
         id: id || uuidv4(),
         object: "chat.completion",
         created: new Date().getTime(),
         model: agentName,
         choices: [
           {
             index: 0,
             delta: {
               content: data,
             },
             logprobs: null,
             finish_reason: "stop",
             stop_reason: null,
           },
         ],
      };
   }
   return data;
};

app.post('/:agentName/prompt', async (req, res) => {
   const { agentName } = req.params;
   console.log('agentName:', agentName);
   console.log('Request body:', req.body); // Now you can access the body directly

   const targetUrl = 'http://' + agentName + '/prompt';
   const parsedUrl = url.parse(targetUrl);

   // Use the body you've already parsed
   const payload = req.body;
   const payloadString = JSON.stringify(payload);

   const timeout = REQUEST_TIMEOUT * 60 * 1000; // timeout 30 minutes
   const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.path,
      method: 'POST',
      timeout: timeout,
      headers: {
         ...req.headers,
         'Content-Type': 'application/json',
         'Content-Length': Buffer.byteLength(payloadString),
      },
   };

   const proxyRequest = http.request(options, (proxyResponse) => {
      const isStreaming = isStreamingResponse(proxyResponse.headers);
      if (isStreaming) {
         // Handle as streaming response
         res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
         // proxyResponse.pipe(res);
         proxyResponse.on('data', (chunk) => {
            res.write(chunk);

            if (chunk.toString().includes('[DONE]')) {
               res.end();
            }
         });

         proxyResponse.on('end', () => {
            res.end();
         });
         } else {
         // Handle as regular response
         let responseData = '';

         proxyResponse.on('data', (chunk) => {
            responseData += chunk;
         });

         proxyResponse.on('end', () => {
            let result;
            try {
               result = tryToParseStringJson(responseData);
            } catch (e) {
               console.error('Error parsing response:', e);
               result = responseData;
            }

            if (!!payload.ping) {
               res.status(proxyResponse.statusCode).json(result);
            } else {
               res.status(proxyResponse.statusCode).json(normalizeResponse(payload?.id || '', result, agentName));
            }
         });
      }
   });

   // Set timeout handler
   proxyRequest.setTimeout(timeout, () => {
      console.log('Request timed out!');
      proxyRequest.destroy();
   });

   proxyRequest.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.status(500).json({
         error: 'Internal Server Error',
      });
   });

   // Write the request body to the proxy request
   proxyRequest.write(payloadString);
   proxyRequest.end();
   return;
});


const PORT = 80;
app.listen(PORT, '0.0.0.0', () => {
   console.log(`Proxy server running on http://localhost:${PORT}`);
});
