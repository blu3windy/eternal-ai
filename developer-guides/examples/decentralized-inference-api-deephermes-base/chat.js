const https = require("https");

function chat() {
  const options = {
    hostname: "api.eternalai.org",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer $ETERNALAI_API_KEY",
      "Accept": "text/event-stream"
    }
  };

  const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Request failed with status code ${res.statusCode}`);
      res.resume();
      return;
    }

    let buffer = "";
    let printedOnchainData = false; // Track if onchain_data is printed

    // console.log("Streaming response...\n");

    res.setEncoding("utf8");

    res.on("data", (chunk) => {
      buffer += chunk;

      let lines = buffer.split("\n");
      buffer = lines.pop(); // Keep incomplete chunk

      for (let line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const json = JSON.parse(line.slice(6).trim());

            // Print `onchain_data` only when `code: 100` and `infer_id` is NOT empty
            if (
              json.code === 100 &&
              json.onchain_data &&
              json.onchain_data.infer_id &&
              json.onchain_data.infer_id !== "" &&
              !printedOnchainData
            ) {
              console.log("\n\nOnchain Data:", JSON.stringify(json.onchain_data, null, 2), "\n");
              printedOnchainData = true;
            }

            // Print streaming content smoothly
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              process.stdout.write(content.replace(/\s+/g, " ")); // Clean spaces & print smoothly
            }
          } catch (err) {
            console.error("\nError parsing JSON:", err.message);
          }
        }
      }
    });

    res.on("end", () => {
      // console.log("\nStream complete.");
    });
  });

  req.on("error", (err) => {
    console.error(`Request error: ${err.message}`);
  });

  req.write(
    JSON.stringify({
      stream: true,
      model: "NousResearch/DeepHermes-3-Llama-3-8B-Preview",
      chain_id: "8453",
      max_tokens: 1024,
      messages: [
        { role: "system", content: "You are a 10x blockchain engineer." },
        { role: "user", content: "Give a short overview of p2p system" }
      ]
    })
  );

  req.end();
}

chat();
