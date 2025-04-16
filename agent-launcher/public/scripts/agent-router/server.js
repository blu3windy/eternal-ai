const express = require("express");
const http = require("http");
const url = require("url");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

const REQUEST_TIMEOUT = 120; // 120 minutes
const FILE_RETENTION_HOURS = 72; // 72 hours
const PROCESSING_REQUESTS = {};

// TODO: add api request log error for rollbar end point  
// where is context?

const logError = async (title, body, level = 'error') => {
    console.log('logError', title, body, level);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "access_token": "0b1d40e4a6c94f19b9c39a7b8cc5cea184130e2685cb6e38689a17843c0765e9228dd3b611b559e3ae5176dfe3ab7f12",
      "data": {
        "environment": "production",
        "body": {
          "message": {
            "body": title
          }
        },
        "level": level,
        "timestamp": new Date().getTime(),
        "platform": "browser",
        "language": "javascript",
        "framework": "react",
        "custom": {
          tracking_data: body
        }
      }
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://api.rollbar.com/api/1/item", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log("result", result);
      })
      .catch((error) => {
        console.log("error", error);
      });
};

// Enable CORS for all origins
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    credentials: true,
  })
);

// Add body parser middleware to parse JSON bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.options("*", cors()); // Enable preflight for all routes

const tryToParseStringJson = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
};

const isStreamingResponse = (headers) => {
  return (
    headers["content-type"]?.includes("text/event-stream") ||
    headers["content-type"]?.includes("application/x-ndjson") ||
    headers["transfer-encoding"]?.includes("chunked")
  );
};

const logDir = path.join(process.cwd(), "data", "requests");

const getRequestFilePath = (agentName) => {
  return `${logDir}/${agentName}`;
};

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
};

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
      status: 102,
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

const writeRequestEndLogger = async (id, data, status, agentName) => {
  try {
    if (!id) {
      return null;
    }
    await checkLogDir(agentName);
    const existingLog = await readLogFile(id, agentName);
    if (!existingLog) {
      return;
    }

    if (existingLog.status === 200 || existingLog.status === 500) {
      return;
    }

    const updatedLog = {
      ...existingLog,
      status,
      updatedAt: new Date().toISOString(),
      data: data,
    };

    const filename = getFileName(id);
    const filepath = path.join(getRequestFilePath(agentName), filename);
    await fs.writeFile(filepath, JSON.stringify(updatedLog, null, 2), "utf-8");
  } catch (error) {
    console.error("Error logging request:", error);
  }
  return;
};

const normalizeResponse = (id, data, agentName) => {
  if (typeof data === "string") {
    return {
      id: id || uuidv4(),
      object: "chat.completion",
      created: new Date().getTime(),
      model: agentName,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: data,
          },
          finish_reason: "stop",
          stop_reason: null,
        },
      ],
    };
  }
  return data;
};

const normalizeChunkResponse = (id, data, agentName, stop) => {
  if (typeof data === "string") {
    return {
      id: id || uuidv4(),
      object: "chat.completion.chunk",
      created: new Date().getTime(),
      model: agentName,
      choices: [
        {
          index: 0,
          delta: {
            content: data,
          },
          logprobs: null,
          finish_reason: stop ? "stop" : null,
        },
      ],
    };
  }

  return data;
};

const parseObjectFromStream = (data) => {
  try {
    const jsonChunk = tryToParseStringJson(
      data.toString().replace?.("data: ", "")
    );
    if (typeof jsonChunk === "string") {
      return jsonChunk;
    }
    return jsonChunk;
  } catch (err) {
    return data;
  }
};

const parseDataFromStream = (data) => {
  let content = "";
  try {
    const jsonChunk = tryToParseStringJson(
      data.toString().replace?.("data: ", "")
    );
    if (typeof jsonChunk === "string") {
      return jsonChunk;
    }
    try {
      let chunk = "";
      if (jsonChunk.choices && jsonChunk.choices[0].delta) {
        chunk = jsonChunk?.choices?.[0]?.delta?.content || "";
        content += chunk;
      } else {
        content = JSON.stringify(jsonChunk);
      }
    } catch (err) {
      content = JSON.stringify(jsonChunk);
    }
  } catch (err) {}
  return content;
};

app.post("/:agentName/prompt", async (req, res) => {
  const { agentName } = req.params;

  const targetUrl = "http://" + agentName + "/prompt";
  const parsedUrl = url.parse(targetUrl);

  // Use the body you've already parsed
  const payload = req.body;
  const payloadString = JSON.stringify(payload);


  const timeout = REQUEST_TIMEOUT * 60 * 1000; // timeout 30 minutes
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 80,
    path: parsedUrl.path,
    method: "POST",
    timeout: timeout,
    headers: {
      ...req.headers,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payloadString),
    },
  };


  logError('AGENT_ROUTER_REQUEST', {...payload}, 'info');


  if (payload?.messages?.length > 0) {
    console.log("agentName:", agentName);
    console.log("Request body:", req.body); // Now you can access the body directly
  }

  if (payload?.id && !payload?.ping) {
    try {
      const existedLog = await writeRequestStartLogger(
        payload?.id || "",
        payload,
        agentName
      );
      if (existedLog?.status) {
        if (existedLog?.status === 102) {
          if (PROCESSING_REQUESTS[payload?.id]) {
            res.status(200).json({
              status: 102,
            });
          } else {
            writeRequestEndLogger(payload.id, existedLog.data, 200, agentName);
            res
              .status(200)
              .json(
                normalizeResponse(
                  payload?.id || "",
                  tryToParseStringJson(existedLog.data),
                  agentName
                )
              );
          }

          return;
        }
        if (existedLog?.status === 500) {
          logError('AGENT_ROUTER_RESPONSE_ERROR', {...tryToParseStringJson(existedLog.data)}, 'error');
          res.status(500).json(tryToParseStringJson(existedLog.data));
          return;
        }
        res
          .status(200)
          .json(
            normalizeResponse(
              payload?.id || "",
              tryToParseStringJson(existedLog.data),
              agentName
            )
          );
        return;
      } else {
        if (PROCESSING_REQUESTS[payload?.id]) {
          res.status(200).json({
            status: 102,
          });
          return;
        }
      }
    } catch (error) {
      logError('AGENT_ROUTER_RESPONSE_ERROR', {...error}, 'error');
      //
    }
  }

  if (payload?.id && !payload?.ping) {
    PROCESSING_REQUESTS[payload?.id] = true;
  }
  const proxyRequest = http.request(options, (proxyResponse) => {
    const isStreaming = isStreamingResponse(proxyResponse.headers);
    if (isStreaming) {
      let responseData = "";
      // Handle as streaming response
      res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      // proxyResponse.pipe(res);
      proxyResponse.on("data", (chunk) => {
        res.write(chunk);
        if (chunk.toString().includes("[DONE]")) {
          res.end();
          if (payload?.id) {
            setTimeout(() => {
              // delay 1s to ensure the responseData is complete
              writeRequestEndLogger(
                payload.id,
                responseData,
                proxyResponse.statusCode,
                agentName
              );
            }, 1000);
          }
        } else {
          // Split the chunk by newlines to handle multiple events
          try {
            if (payload?.id) {
              const chunks = chunk.toString().split("\n\n");
              for (const chunkData of chunks) {
                if (!chunkData.trim()) continue;
                const chunkText = parseDataFromStream(chunkData);

                responseData += chunkText;
                if (payload?.id) {
                  writeRequestEndLogger(
                    payload.id,
                    responseData,
                    102,
                    agentName
                  );
                }
              }
            }
          } catch (e) {
            console.log('AGENT_ROUTER_RESPONSE_ERROR_STREAM', {agentName, e});
            
            logError('AGENT_ROUTER_RESPONSE_ERROR_STREAM', {agentName, e}, 'error');
          }
        }
      });

      proxyResponse.on("end", () => {
        res.end();
        if (payload?.id) {
          delete PROCESSING_REQUESTS[payload?.id];
          writeRequestEndLogger(
            payload.id,
            responseData,
            proxyResponse.statusCode,
            agentName
          );
        }
      });
    } else {
      // Handle as regular response
      let responseData = "";

      proxyResponse.on("data", (chunk) => {
        responseData += chunk;
      });

      proxyResponse.on("end", () => {
        let result;
        try {
          result = tryToParseStringJson(responseData);
        } catch (e) {
          logError('AGENT_ROUTER_RESPONSE_ERROR_END_PARSE', {...e}, 'error');
          console.error("Error parsing response:", e);
          result = responseData;
        }

        if (!!payload.ping) {
          res.status(proxyResponse.statusCode).json(result);
        } else {
          const normalizedResponse = normalizeResponse(
            payload?.id || "",
            result,
            agentName
          );
          console.log('normalizedResponse', JSON.stringify(normalizedResponse));
          
          res.status(proxyResponse.statusCode).json(normalizedResponse);
          if (payload?.id) {
            writeRequestEndLogger(
              payload?.id || "",
              normalizedResponse,
              proxyResponse.statusCode,
              agentName
            );
          }
        }

      });
    }
  });

  // Set timeout handler
  proxyRequest.setTimeout(timeout, () => {
    console.log("Request timed out!");
    proxyRequest.destroy();
  });

  proxyRequest.on("error", (err) => {
    console.error("Proxy request error:", err);
    res.status(500).json({
      error: JSON.stringify(err),
    });
    if (payload?.id) {
      writeRequestEndLogger(
        payload?.id || "",
        JSON.stringify(err),
        500,
        agentName
      );
      delete PROCESSING_REQUESTS[payload?.id];
    }
  });

  // Write the request body to the proxy request
  proxyRequest.write(payloadString);
  proxyRequest.end();
  return;
});

const cleanupOldFiles = async () => {
  try {
    const now = new Date();
    const files = await fs.readdir(logDir);

    const readLogFileFromPath = async (pathOfFile) => {
      try {
        const fileContent = await fs.readFile(pathOfFile, "utf-8");
        return JSON.parse(fileContent);
      } catch (error) {
        return null;
      }
    };

    for (const agentDir of files) {
      const agentPath = path.join(logDir, agentDir);
      const agentFiles = await fs.readdir(agentPath);

      for (const file of agentFiles) {
        const filePath = path.join(agentPath, file);
        const stats = await fs.stat(filePath);
        const hoursOld = (now - stats.mtime) / (1000 * 60 * 60);

        if (hoursOld > FILE_RETENTION_HOURS) {
          const existedLog = await readLogFileFromPath(filePath);
          if (existedLog && existedLog.status !== 102) {
            await fs.unlink(filePath);
            console.log(`Deleted old file: ${filePath}`);
          }
        }
      }
    }
  } catch (error) {
    // console.error('Error cleaning up old files:', error);
  }
};

const PORT = 80;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);

  // Run initial cleanup
  cleanupOldFiles();
});
