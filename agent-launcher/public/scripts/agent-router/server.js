const express = require("express");
const http = require("http");
const url = require("url");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

const REQUEST_TIMEOUT = 30; // 30 minutes
const FILE_RETENTION_HOURS = 72; // 72 hours
const PROCESSING_REQUESTS = {};

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

const pingToServer = async (options, id, agentName) => {
  try {
    const payloadString = JSON.stringify({
      ping: true,
    });

    const timeout = 30 * 1000; // 30s
    // Try pinging the server to check if it's still processing
    const pingOptions = {
      ...options,
      timeout: timeout,
      headers: {
        ...options.headers,
        "Content-Length": Buffer.byteLength(payloadString),
      },
    };

    const pingRequest = http.request(pingOptions, (pingResponse) => {
      if (pingResponse.statusCode !== 200) {
        writeRequestEndLogger(
          id || "",
          "Server is not responding",
          500,
          agentName
        );
      }
    });

    // Set timeout handler
    pingRequest.setTimeout(timeout, () => {
      pingRequest.destroy();
    });

    pingRequest.on("error", () => {
      writeRequestEndLogger(
        id || "",
        "Server is not responding",
        500,
        agentName
      );
    });

    pingRequest.write(payloadString);
    pingRequest.end();
  } catch (error) {
    //
  }
};

const setRequestToErrorIfLargerThanTimeout = async (
  options,
  id,
  agentName,
  existedLog
) => {
  try {
    // Check if request has been running for more than 30 minutes
    const now = new Date();
    const createdAt = new Date(existedLog.createdAt);
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (diffMinutes > REQUEST_TIMEOUT) {
      writeRequestEndLogger(
        id || "",
        "Server is not responding",
        500,
        agentName
      );
    } else {
      pingToServer(options, id, agentName);
    }
  } catch (error) {
    //
  }
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
          res.status(200).json({
            status: 102,
          });

          if (!PROCESSING_REQUESTS[payload?.id]) {
            setRequestToErrorIfLargerThanTimeout(
              options,
              payload?.id || "",
              agentName,
              existedLog
            );
          }

          return;
        }
        if (existedLog?.status === 500) {
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
      }
    } catch (error) {
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
              const chunks = chunk.toString().split(/(?<=data: )\n\n/);
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
          } catch (e) {}
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
      error: "Internal Server Error",
    });
    if (payload?.id) {
      writeRequestEndLogger(
        payload?.id || "",
        "Internal Server Error",
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
