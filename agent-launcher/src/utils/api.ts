import {tryToParseJsonString} from './string';
import {ChatCompletionStreamHandler, IOnchainData, StreamResponseOption} from "../services/api/agent/types.ts";

const getOptions = (
  chunkDataJson: Record<string, unknown>,
): StreamResponseOption => {
  if (chunkDataJson.code === 102 && chunkDataJson.message) {
    return {
      message: chunkDataJson.message as string,
      onchain_data: chunkDataJson?.onchain_data as IOnchainData,
    } satisfies StreamResponseOption;
  }
  if (
    chunkDataJson.code === 302 &&
    chunkDataJson.message === 'MINER_DONE_AND_START_SUBMIT'
  ) {
    return {
      isGeneratedDone: true,
      onchain_data: chunkDataJson?.onchain_data as IOnchainData,
    } satisfies StreamResponseOption;
  }
  return {
    message: chunkDataJson.message as string,
    onchain_data: chunkDataJson?.onchain_data as IOnchainData,
  } satisfies StreamResponseOption;
};

export const parseStreamAIResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  options: ChatCompletionStreamHandler,
) => {
  const { onStream, onFinish, onFail } = options;

  try {
    const decoder = new TextDecoder('utf-8');

    let buffer = '';
    let content = '';
    while (true) {
      const { done, value } = await reader.read(); // Read a chunk of data
      if (done) {
        onFinish(content, {});
        break;
      } // Exit loop if all data has been read

      buffer += decoder.decode(value); // Decode the chunk and append to buffer
      const parts = buffer.split('\n\n'); // Split buffer into parts based on newlines

      // Iterate through each part (event) in the buffer
      for (let i = 0; i < parts.length - 1; i++) {
        const event = parts[i];
        if (event.startsWith('data:')) {
          if (event === 'data: [DONE]') {
            const jsonChunk = tryToParseJsonString(
              event?.replace?.('data: ', ''),
            );
            onFinish(content, getOptions(jsonChunk));
            return;
          }
          if (event.startsWith('data:')) {
            const jsonChunk = tryToParseJsonString(
              event?.replace?.('data: ', ''),
            );
            if (jsonChunk.message === 'ERROR_QUERY_EMPTY') {
              throw new Error('ERROR_QUERY_EMPTY');
            }
            let chunk = '';
            if (jsonChunk.choices && jsonChunk.choices[0].delta) {
              chunk = jsonChunk?.choices?.[0]?.delta?.content || '';
              content += chunk;
            }

            onStream(content, chunk, getOptions(jsonChunk));
          }
        }
      }
      buffer = parts[parts.length - 1];
    }
  } catch (err) {
    onFail(err);
  }
};
