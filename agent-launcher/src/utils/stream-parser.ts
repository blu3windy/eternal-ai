import { tryToParseJsonString } from "./string";

interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content: string;
    };
    finish_reason: string | null;
  }>;
  system_fingerprint: string;
  message: string;
}

export const parseSSEJsonObjects = (
  sseString: string
): ChatCompletionChunk[] => {
  // Split the string into individual events
  const events = sseString.split("\n\n").filter((event) => event.trim());

  const jsonObjects: ChatCompletionChunk[] = [];

  for (const event of events) {
    // Remove the "data: " prefix if it exists
    const jsonStr = event.replace(/^data:\s*/, "").trim();

    // Skip [DONE] messages
    if (jsonStr === "[DONE]") continue;

    try {
      const jsonObj = tryToParseJsonString(jsonStr) as ChatCompletionChunk;
      if (jsonObj && typeof jsonObj === "object") {
        jsonObjects.push(jsonObj);
      }
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      continue;
    }
  }

  return jsonObjects;
};

// Helper function to extract content from chunks
export const extractContentFromChunks = (
  chunks: ChatCompletionChunk[]
): string => {
  return chunks
    .map((chunk) => chunk.choices?.[0]?.delta?.content || "")
    .join("");
};
