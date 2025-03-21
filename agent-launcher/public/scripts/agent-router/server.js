
const express = require('express');
const http = require('http');
const url = require('url');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true
}));

// Add body parser middleware to parse JSON bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.options('*', cors()); // Enable preflight for all routes

const logDir = path.join(process.cwd(), "data", "requests");

const getRequestFilePath = (agentName) => {
    return `${logDir}/${agentName}`
}

const checkLogDir = async (agentName) => {
    try {
        // Create log directory if it doesn't exist
        await fs.mkdir(getRequestFilePath(agentName), { recursive: true });
    } catch (e) {
        //
    }
};

const getFileName = (id) => { 
    return `${id}.json`;
}

const readLogFile = async (id, agentName) => {
    try {
        const filename = getFileName(id);
        const filepath = path.join(getRequestFilePath(agentName), filename);
        const fileContent = await fs.readFile(filepath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        return null;
    }
};


const writeRequestStartLogger = async (id, payload, agentName) => {
    try {
        if (!id) {
            return null;
        }
        await checkLogDir(agentName);
        const existedLog = await readLogFile(id, agentName);
        if (existedLog) {
            return existedLog;
        }
        const log = {
            createdAt: new Date().toISOString(),
            body: payload,
            status: 102
        };

        // Create filename with timestamp
        const filename = getFileName(id);
        const filepath = path.join(getRequestFilePath(agentName), filename);

        // Write log to file
        await fs.writeFile(filepath, JSON.stringify(log, null, 2), "utf-8");
    } catch (error) {
        console.error("Error logging request:", error);
    }
    return null;
};
  
const writeRequestEndLogger = async (id,data,status, agentName) => {
    try {
        if (!id) {
            return null;
        }
        await checkLogDir(agentName);
        const existingLog = await readLogFile(id, agentName);
        if (!existingLog) {
            return;
        }

        const updatedLog = {
            ...existingLog,
            status,
            updatedAt: new Date().toISOString(),
            data: data
        };

        const filename = getFileName(id, agentName);
        const filepath = path.join(getRequestFilePath(agentName), filename);
        await fs.writeFile(filepath, JSON.stringify(updatedLog, null, 2), "utf-8");
    } catch (error) {
        console.error("Error logging request:", error);
    }
    return;
};

// ... keep your existing helper functions ...

const tryToParseStringJson = (data) => { 
    try {
        return JSON.parse(data);
    } catch (error) { 
        return data;
    }
}

app.post('/:agentName/prompt', async (req, res) => {
    const { agentName } = req.params;
    console.log("agentName:", agentName);
    console.log("Request body:", req.body); // Now you can access the body directly
    
    const targetUrl = 'http://' + agentName + '/prompt';
    const parsedUrl = url.parse(targetUrl);
    
    // Use the body you've already parsed
    const payload = req.body;
    const payloadString = JSON.stringify(payload);
    
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
            ...req.headers,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payloadString)
        }
    };

    if (payload?.id && !payload?.ping) {
        const existedLog = await writeRequestStartLogger(
            payload?.id || "",
            payload,
            agentName
        );
        
        if (existedLog?.status) {
            if (existedLog?.status === 102) {
                res.status(200).json({
                    status: 102
                });
                return;
            }
            if (existedLog?.status === 500) {
                res.status(500).json(tryToParseStringJson(existedLog.data));
                return;
            }
            res.status(200).json(tryToParseStringJson(existedLog.data));
            return;
        }
        
        const proxyRequest = http.request(options, (proxyResponse) => {
            let responseData = '';
            
            proxyResponse.on('data', (chunk) => {
                responseData += chunk;
            });
            
            proxyResponse.on('end', () => {
                let result;
                try {
                    // if (typeof responseData === 'string') { 
                    //     result = responseData;
                    // } else {
                    //     result = tryToParseStringJson(responseData);
                    // }
                    result = tryToParseStringJson(responseData);
                } catch (e) {
                    console.error('Error parsing response:', e);
                    result = responseData;
                }
                
                res.status(proxyResponse.statusCode).json(result);
                writeRequestEndLogger(payload?.id || "", result, proxyResponse.statusCode, agentName);
            });
        });
        
        proxyRequest.on('error', (err) => {
            console.error('Proxy request error:', err);
            res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
            });
            writeRequestEndLogger(payload?.id || "", 'Internal Server Error', 500, agentName);
        });
        
        // Write the request body to the proxy request
        proxyRequest.write(payloadString);
        proxyRequest.end();
    } else {
        const proxyRequest = http.request(options, (proxyResponse) => {
            let responseData = '';
            
            proxyResponse.on('data', (chunk) => {
                responseData += chunk;
            });
            
            proxyResponse.on('end', () => {
                let result;
                try {
                    // if (typeof responseData === 'string') { 
                    //     result = responseData;
                    // } else {
                    //     result = tryToParseStringJson(responseData);
                    // }
                    result = tryToParseStringJson(responseData);
                } catch (e) {
                    console.error('Error parsing response:', e);
                    result = responseData;
                }
                
                res.status(proxyResponse.statusCode).json({
                    status: 200,
                    data: result
                });
            });
        });
        
        proxyRequest.on('error', (err) => {
            console.error('Proxy request error:', err);
            res.status(500).json({ 
                status: 500,
                error: 'Internal Server Error'
             });
        });
        
        // Write the request body to the proxy request
        proxyRequest.write(payloadString);
        proxyRequest.end();
    }
});

const PORT = 80
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});