import { ethers } from 'ethers';
import { JSDOM } from 'jsdom';
import { jsonrepair } from 'jsonrepair';
import { DateTime } from 'luxon';
import { ChainId } from '../src/constants';
import Interact from '../src/interact';
import { Message } from '../src/methods/infer/types';
import { InferPayloadWithMessages } from '../src/types';
// npm install typescript jsdom luxon jsonrepair

export const AGENT_CONTRACT_ADDRESSES: Record<ChainId, string> = {
  56: '0x3B9710bA5578C2eeD075D8A23D8c596925fa4625',
  8453: '0x643c45e89769a16bcb870092bd1efe4696cb2ce7',
};

const DEEPSEEK_LLM_URL = 'https://vcr6xaelfq1f77-8000.proxy.runpod.net/v1';
const DEEPSEEK_MODEL_ID = 'DeepSeek-R1-Distill-Llama-70B';
const LLAMA_LLM_URL = 'https://6k2x3hq1kul5um-8000.proxy.runpod.net/v1';
const LLAMA_MODEL_ID = 'Llama3.3';
const API_KEY = 'd50b6ba5169ea538a71fe7b0685b755823a3746934fa3cc4';
const BING_SEARCH_API_KEY = 'f1ae6f4e1fb644758ac06cbdf1ce99ab';

const wallet = new ethers.Wallet('private key');
const interact = new Interact(wallet);

function getAnswerFromResponse(response: string): string {
  return response.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

function parseDeepseekResult(content: string): {
  think: string;
  answer: string;
} {
  const result: { think: string; answer: string } = { think: '', answer: '' };
  const start = 0;
  const end = content.indexOf('</think>');

  if (end !== -1) {
    result.think = content.substring(start, end).trim();
    result.answer = content.substring(end + '</think>'.length).trim();
  }

  return result;
}

async function interactContractLLM(messages: Message[]): Promise<string> {
  const inferPayload = {
    chainId: ChainId.BSC,
    agentAddress: AGENT_CONTRACT_ADDRESSES[ChainId.BSC],
    messages: messages,
  } satisfies InferPayloadWithMessages;

  try {
    const response = await interact.infer(inferPayload); // Type assertion
    return response;
  } catch (error) {
    return error instanceof Error ? error.message : 'Unknown error';
  }
}

async function callThinkingLLM(messages: any[]): Promise<[any, string | null]> {
  const endpoint = `${DEEPSEEK_LLM_URL.replace(/\/$/, '')}/chat/completions`;
  const payload = {
    model: DEEPSEEK_MODEL_ID,
    messages: messages,
    temperature: 0,
    stream: true,
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  };

  let finalResponse = '';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    if (!reader) {
      throw new Error('Failed to get response body reader');
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const dataChunks = chunk.split('data: ');

      for (const data of dataChunks) {
        if (!data.trim()) continue;
        if (data.trim() === '[DONE]') break;

        try {
          const jsonData = JSON.parse(data);
          finalResponse += jsonData.choices[0].delta.content;
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    }

    return [parseDeepseekResult(finalResponse), null];
  } catch (error) {
    return [{}, error instanceof Error ? error.message : 'Unknown error'];
  }
}

async function callFastLLM(
  messages: any[],
  maxTokens?: number
): Promise<[any, string | null]> {
  const endpoint = `${LLAMA_LLM_URL.replace(/\/$/, '')}/chat/completions`;
  const payload: any = {
    model: LLAMA_MODEL_ID,
    messages: messages,
    temperature: 0,
    stream: false,
  };
  if (maxTokens) {
    payload.max_tokens = maxTokens;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    return [
      { answer: jsonResponse.choices[0].message.content, think: '' },
      null,
    ];
  } catch (error) {
    return [{}, error instanceof Error ? error.message : 'Unknown error'];
  }
}

// Bing Search API
async function performSearch(
  query: string,
  topK: number = 1
): Promise<[any[], string | null]> {
  try {
    console.log(`Searching with query ${query}...`);
    const url = 'https://api.bing.microsoft.com/v7.0/search';

    const headers = {
      'Ocp-Apim-Subscription-Key': BING_SEARCH_API_KEY,
      'Content-Type': 'application/json',
    };
    const params = new URLSearchParams({
      responseFilter: 'Webpages',
      q: query,
      count: topK.toString(),
      setLang: 'en-GB',
      textDecorations: 'false',
      textFormat: 'HTML',
      safeSearch: 'Strict',
    });

    const response = await fetch(`${url}?${params.toString()}`, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const searchResults = await response.json();
    if (!searchResults.webPages) {
      console.warn(`No search results found for query: ${query}`);
      return [[], null];
    }

    const results = searchResults.webPages.value
      .filter((result: any) => !result.url.includes('youtube.com'))
      .map((result: any) => ({
        title: result.name,
        href: result.url,
        body: result.snippet,
      }));

    return [results, null];
  } catch (error) {
    return [[], error instanceof Error ? error.message : 'Unknown error'];
  }
}
async function crawlDataFromUrl(
  url: string,
  raiseOnError: boolean = false
): Promise<{ content: string; error: string | null }> {
  try {
    const response = await fetch(url, { redirect: 'follow' });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const scriptAndStyleElements = doc.querySelectorAll('script, style');
    scriptAndStyleElements.forEach((element) => element.remove());

    const textElements: string[] = [];
    const tags: string[] = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'p',
      'li',
      'div',
      'span',
    ];

    tags.forEach((tagName) => {
      const elements = doc.querySelectorAll(tagName);
      elements.forEach((element) => {
        const text = element.textContent?.trim() || '';

        if (!text) {
          return;
        }

        if (text.split(' ').length < 3) {
          return;
        }

        const parentClasses = element.parentElement?.classList; // removed || []
        if (parentClasses && parentClasses.contains) {
          // added check
          if (
            ['nav', 'menu', 'sidebar', 'footer'].some((cls) =>
              parentClasses.contains(cls)
            )
          ) {
            return;
          }
        }

        const cleanedText = text.split(/\s+/).join(' ');
        textElements.push(cleanedText);
      });
    });

    const rawContent = textElements.join('\n\n');

    const lines = rawContent.split('\n').map((line) => line.trim());
    const chunks = lines.flatMap((line) =>
      line.split('  ').map((phrase) => phrase.trim())
    );
    const content = chunks.filter((chunk) => chunk).join('\n');

    return { content: content, error: null };
  } catch (error) {
    return { content: '', error: String(error) };
  }
}

async function extractRelevantContext(
  userQuery: string,
  searchQuery: string,
  pageText: string
): Promise<string> {
  const prompt =
    "You are an expert information extractor. Given the user's query, the search query that led to this page, and the webpage content, extract all pieces of information that are relevant to answering the user's query. Return only the relevant context as plain text without commentary.";

  const messages = [
    {
      role: 'system',
      content:
        'You are an expert in extracting and summarizing relevant information.',
    },
    {
      role: 'user',
      content: `User Query: ${userQuery}\nSearch Query: ${searchQuery}\n\nWebpage Content (first 20000 characters):\n${pageText.slice(
        0,
        20000
      )}\n\n${prompt}`,
    },
  ];

  const [response, _] = await callThinkingLLM(messages);
  const extractedText = response.answer?.trim() || '';

  return extractedText;
}

async function process_link(
  link: string,
  user_query: string,
  search_query: string
): Promise<string> {
  console.log('Fetching content from:', link);
  const page_text = await crawlDataFromUrl(link);
  if (page_text['content'] == '') return '';
  console.log('Extracting relevent content from:', link);
  const context = await extractRelevantContext(
    user_query,
    search_query,
    page_text['content']
  );
  console.log('Page usefulness for ', link, ':', context != '');
  if (context != '') {
    console.log(
      'Extracted content from',
      link,
      '(first 200 chars):',
      context.slice(0, 200)
    );
    return context;
  }
  return '';
}

async function generateSearchQueries(
  userQuery: string,
  maxIterations: number = 1
): Promise<string[]> {
  /**
   * Ask the LLM to produce up to four precise search queries (in Python list format)
   * based on the user’s query.
   */

  const dynamicExample = Array.from(
    { length: maxIterations },
    (_, i) => `\"query ${i + 1}\"`
  ).join(', ');

  const prompt = `
Write ${maxIterations} google search queries to search online that form an objective opinion from the following task: "${userQuery}"

Assume the current date is ${DateTime.utc().toFormat(
    'MMMM dd, yyyy'
  )} if required.

You must respond with a list of strings in the following format: [${dynamicExample}].
The response should contain ONLY the list.
`;
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful and precise research assistant.',
    },
    { role: 'user', content: `User Query: ${prompt}` },
  ];

  try {
    // const llmCall = await callThinkingLLM(messages); // Type assertion
    const response = await interactContractLLM(messages); // Type assertion

    // const response = await interact.infer(inferPayload); // Type assertion
    // console.log('🚀 ~ resFromContract:', llmCall);
    // const response = llmCall;

    const answer = getAnswerFromResponse(response);

    if (response && answer) {
      try {
        const repairedJsonString = answer; // Get the repaired string
        console.log('🚀 ~ repairedJsonString:', repairedJsonString);
        const searchQueries = JSON.parse(repairedJsonString); // Parse the string into a JavaScript array
        console.log('🚀 ~ searchQueries:', searchQueries);

        if (Array.isArray(searchQueries)) {
          return searchQueries as string[]; // Type assertion
        } else {
          console.error('LLM did not return a list. Response:', response);
          return [];
        }
      } catch (e) {
        console.error(
          'Error parsing search queries:',
          e,
          '\nResponse:',
          response
        );
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error calling LLM:', error);
    return [];
  }
}

async function getNewSearchQueries(
  userQuery: string,
  previousSearchQueries: string[],
  allContexts: string[]
): Promise<string[] | '<done>'> {
  /**
   * Based on the original query, the previously used search queries, and all the extracted contexts,
   * ask the LLM whether additional search queries are needed. If yes, return a Python list of up to four queries;
   * if the LLM thinks research is complete, it should return "<done>".
   */
  const contextCombined = allContexts.join('\n');
  const prompt = `
You are an analytical research assistant. Based on the original query, the search queries performed so far, 
and the extracted contexts from webpages, determine if further research is needed. 
If further research is needed, provide up to four new search queries as a Python list (for example, 
['new query1', 'new query2']). If you believe no further research is needed, respond with exactly <done>.
\nOutput only a Python list or the token <done> without any additional text.
`;
  const messages: Message[] = [
    { role: 'system', content: 'You are a systematic research planner.' },
    {
      role: 'user',
      content: `User Query: ${userQuery}\nPrevious Search Queries: ${previousSearchQueries}\n\nExtracted Relevant Contexts:\n${contextCombined}\n\n${prompt}`,
    },
  ];

  try {
    // const llmCall = await callThinkingLLM(messages); // Type assertion
    // const response = llmCall[0];
    const response = await interactContractLLM(messages); // Type assertion
    console.log('🚀 ~ callThinkingLLM response:', response);
    // const answer = response?.answer || '';
    const answer = getAnswerFromResponse(response);

    if (response) {
      const cleaned = response.trim();
      if (cleaned === '<done>') {
        return '<done>';
      }
      try {
        const repairedJsonString = jsonrepair(answer); // Get the repaired string
        const newQueries = JSON.parse(repairedJsonString); // Parse the string into a JavaScript array

        if (Array.isArray(newQueries)) {
          return newQueries as string[];
        } else {
          console.log(
            'LLM did not return a list for new search queries. Response:',
            answer
          );
          return [];
        }
      } catch (e) {
        console.error(
          'Error parsing new search queries:',
          e,
          '\nResponse:',
          answer
        );
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error calling LLM', error);
    return [];
  }
}

async function generateFinalReport(
  userQuery: string,
  allContexts: string[]
): Promise<string> {
  /**
   * Generate the final comprehensive report using all gathered contexts.
   */
  const contextCombined = allContexts.join('\n');
  const prompt = `
You are an expert researcher and report writer. Based on the gathered contexts below and the original query, 
write a comprehensive, well-structured, and detailed report that addresses the query thoroughly. 
Include all relevant insights and conclusions without extraneous commentary.
`;
  const messages: Message[] = [
    { role: 'system', content: 'You are a skilled report writer.' },
    {
      role: 'user',
      content: `User Query: ${userQuery}\n\nGathered Relevant Contexts:\n${contextCombined}\n\n${prompt}`,
    },
  ];

  try {
    const response = await interactContractLLM(messages); // Type assertion
    const report = getAnswerFromResponse(response);
    return report;
  } catch (error) {
    console.error('Error generating final report', error);
    return ''; // or throw error, depending on desired behavior
  }
}

async function main(
  userQuery: string,
  iterationLimit: number = 3
): Promise<void> {
  let allSearchQueries: string[] = [];
  let aggregatedContexts: string[] = [];
  let searchedLinks: Set<string> = new Set();
  let iteration: number = 0;
  console.log('🚀 ~ userQuery:', userQuery);

  let newSearchQueries = await generateSearchQueries(userQuery);
  console.log('🚀 ~ newSearchQueries:', newSearchQueries);

  if (!newSearchQueries || newSearchQueries.length === 0) {
    console.log('No search queries were generated by the LLM. Exiting.');
    return;
  } else {
    allSearchQueries.push(...newSearchQueries);
    console.log('STEP-1: ', newSearchQueries);
  }

  while (iteration < iterationLimit) {
    console.log(`\n=== Iteration ${iteration + 1} ===`);
    let iterationContexts: string[] = [];

    let searchResults: string[] = [];
    for (const query of newSearchQueries) {
      const results = await performSearch(query, 2);
      const texts = results[0];
      for (const text of texts) {
        const link = text.href;
        if (searchedLinks.has(link)) {
          continue;
        }
        searchedLinks.add(link);
        const context = await process_link(link, userQuery, query);
        if (context !== '') {
          searchResults.push(context);
        }
      }
    }

    const uniqueTexts = Array.from(new Set(searchResults));

    console.log(`Searched results: ${uniqueTexts}`);

    for (const res of uniqueTexts) {
      if (res) {
        iterationContexts.push(res);
      } else {
        console.log(`Skipping empty context: ${res}`);
      }
    }

    if (iterationContexts.length > 0) {
      aggregatedContexts.push(...iterationContexts);
    } else {
      console.log('No useful contexts were found in this iteration.');
    }

    // ----- ASK THE LLM IF MORE SEARCHES ARE NEEDED -----
    const newSearchQueriesOrDone = await getNewSearchQueries(
      userQuery,
      allSearchQueries,
      aggregatedContexts
    );

    if (newSearchQueriesOrDone === '<done>') {
      console.log('LLM indicated that no further research is needed.');
      break;
    } else if (Array.isArray(newSearchQueriesOrDone)) {
      console.log('LLM provided new search queries:', newSearchQueriesOrDone);
      newSearchQueries = newSearchQueriesOrDone; // Assign the array
      allSearchQueries.push(...newSearchQueries);
    } else {
      console.log(
        'LLM did not provide any new search queries. Ending the loop.'
      );
      break;
    }

    iteration++;
  }

  // ----- FINAL REPORT -----
  console.log('\nGenerating final report...');
  const finalReport = await generateFinalReport(userQuery, aggregatedContexts);
  console.log('\n==== FINAL REPORT ====\n');
  console.log(finalReport);
}

const user_query = 'give me recommendations about AI-powered smart desks';

main(user_query).catch(console.error);
