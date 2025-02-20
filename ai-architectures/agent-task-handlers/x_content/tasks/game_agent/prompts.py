JUDGE_GAME_PROMPT_TEMPLATE = """Act as an expert in evaluating and judging the quality of AI-generated responses to tweets.

Your task is to objectively evaluate multiple AI agents' responses to a tweet based on the following criteria:

1. Accuracy and Relevance: Assess how accurately and appropriately each response addresses the content of the tweet.
2. Creativity and Originality: Evaluate the degree of innovation and uniqueness demonstrated in each response.
3. Clarity and Coherence: Determine how well-structured and easy to understand each response is.
4. Adherence to Constraints: Take into account whether each response follows any specific rules or constraints mentioned in the tweet.

List your thoughts for each response before making a final decision. If complex reasoning is required, think step by step and weigh all sides of the topic before settling on the best response. Utilize advanced prompt engineering techniques such as Chain of Thought, Debate simulations, Self Reflection, and Self Consistency where appropriate.

After evaluating all responses, identify the agent with the best response. If multiple agents provide the best response, the winning agent is the one with the earliest best response.

Response format:
Please provide your response as a stringified JSON object with the key "winning_agent" containing the username of the agent with the best response.

Example output:
{{ "winning_agent": "Agent's username" }}

Here are the information of the given tweet:
- Tweet text: {full_text}
- Content images in the tweet: {content_images}

Here are the list of responses that need to be evaluated, sorted from the earliest to the latest:
{answers_content}
"""

JUDGE_FACT_PROMPT_TEMPLATE = """Act as an expert in evaluating and judging the quality of AI-generated responses to tweets.

Your task is to objectively evaluate multiple AI agents' responses to a tweet based on the following criteria:

1. Accuracy and Relevance: Assess how accurately and appropriately each response addresses the content of the tweet.
2. Creativity and Originality: Evaluate the degree of innovation and uniqueness demonstrated in each response.
3. Clarity and Coherence: Determine how well-structured and easy to understand each response is.
4. Adherence to Constraints: Take into account whether each response follows any specific rules or constraints mentioned in the tweet.

List your thoughts for each response before making a final decision. If complex reasoning is required, think step by step and weigh all sides of the topic before settling on the best response. Utilize advanced prompt engineering techniques such as Chain of Thought, Debate simulations, Self Reflection, and Self Consistency where appropriate.

After evaluating all responses, identify the agent with the best response. If multiple agents provide the best response, the winning agent is the one with the earliest best response.

Response format:
Please provide your response as a stringified JSON object with the key "winning_agent" containing the username of the agent with the best response.

Example output:
{{ "winning_agent": "Agent's username" }}

Here are the information of the given tweet:
- Tweet text: {full_text}
- Content images in the tweet: {content_images}

Here are the list of responses that need to be evaluated, sorted from the earliest to the latest:
{answers_content}
"""

FACT_QUERY_PROMPT_TEMPLATE = """**Act as an expert in prompt engineering, information retrieval, and web search optimization.** Your goal is to generate highly effective search queries that retrieve definitive, factual results relevant to a given QA game scenario.

## Task:
You will be provided with a QA game that consists of:
- A question related to a specific topic.
- A list of image descriptions that might provide additional context.
- A timestamp indicating when the QA game started.

Your task is to construct a well-formulated web search query in JSON format that:
- Retrieves concrete, authoritative answers rather than speculative or predictive content.
- Maximizes relevance to the given question while incorporating useful details from the image descriptions.
- Considers the game start timestamp to avoid outdated or premature information.
- Remains neutral and unbiased, avoiding assumptions, opinions, or misleading phrasing.

If the question can be answered without requiring external information, return an empty query string ("").

## Context:
- The query should be structured to work well with search engines like Google or Bing.
- Focus on verifiable facts and avoid queries that might lead to speculative results (e.g., "Who will win X?" should be reframed as "Current standings of X as of <timestamp>").
- Time Sensitivity: If the question relates to an event that may have changed after the QA game started, adjust the search phrasing accordingly (e.g., “latest results,” “as of <timestamp>”).
- If the question contains ambiguity, consider different possible interpretations and choose the most likely intent based on the image descriptions.
- If the image descriptions provide supporting details (e.g., locations, objects, text in images), integrate only the most relevant parts into the query.
- Prioritize clarity and conciseness while ensuring all key elements are included.
- Do not include special search operators (e.g., site:, intitle:) or advanced syntax—only use natural text.

## Response Format:
Return a JSON object with the following structure:

{{
  "query": "<search query>"
}}

Where <search query> is the optimized search string. If no external search is needed, return:

{{
  "query": ""
}}

## Thought Process Before Answering:
- Analyze the question to determine its main focus (who, what, when, where, why, how).
- Examine the image descriptions for details that refine or enhance the query.
- Check the QA game start timestamp to avoid retrieving outdated or future-dependent information.
- Reframe the query to retrieve official or definitive answers rather than speculative content.
- Consider multiple query structures and choose the most effective one.
- Ensure neutrality by avoiding speculative or leading phrases.
- Test for conciseness and clarity, removing unnecessary words.

## Final Instructions:
- Think step by step before crafting the query.
- If useful, simulate a debate between different query structures and choose the best one.
- Use self-reflection to check whether the query could be improved before finalizing.
- Ensure that the query is structured to return authoritative sources with conclusive answers.

## Provided Input Data

Question: {question}

Image Descriptions:
{content_images}

QA Game Start Timestamp: {timestamp}
"""

JUDGE_GAME_WITH_FACTS_PROMPT_TEMPLATE = """**Act as an expert in evaluating and judging the quality of AI-generated responses to tweets.**  

## Task  

Your task is to objectively evaluate multiple AI agents' responses to a tweet based on the following criteria:  

1. **Accuracy and Relevance:** Assess how accurately and appropriately each response addresses the content of the tweet.
2. **Clarity and Coherence:** Determine how well-structured and easy to understand each response is.
3. **Adherence to Constraints:** Take into account whether each response follows any specific rules or constraints mentioned in the tweet.

## Additional Consideration: Future Event Dependency  

- You will be provided with a list of facts related to the tweet.
- The timestamp of the tweet and the current timestamp will also be given. Use this to determine whether the question in the tweet refers to a future event that may not have occurred yet at the time of evaluation.
- If the question in the tweet requires results from a future event to answer, and that future event has not yet occurred based on the given facts, set "result_found" to "false".
- Additionally, set "result_found" to "false" if the result of the future event is not 100% certain based on the given facts.
- Otherwise, set "result_found" to "true".

## Evaluation Process  

1. **Analyze Each Response:** List your thoughts for each response before making a final decision.
2. **Step-by-Step Reasoning:** If complex reasoning is required, break it down step by step and weigh all sides of the topic before settling on the best response.
3. **Consider the Tweet Timestamp and Current Timestamp**: Ensure your evaluation accounts for whether the response is valid based on the time the tweet was posted and the current time.
4. **Advanced Prompting Techniques:** Utilize techniques such as Chain of Thought, Debate Simulations, Self-Reflection, and Self-Consistency to enhance your evaluation.
5. **Determine the Best Response:** Identify the agent with the best response based on the above criteria.
6. **Handling Irrelevant Responses:** If none of the responses are relevant to the question in the tweet, declare the agent with the earliest response as the winner.
7. **Tiebreaker Rule:** If multiple agents provide the best response, select the earliest one.

## Response Format  

Provide your response as a JSON object with the following structure:  

{{
  "winning_agent": "Agent's username",
  "result_found": true/false
}}

## Example Output
{{
  "winning_agent": "Agent123",
  "result_found": false
}}

## Provided Data

Tweet text: {full_text}

Tweet timestamp: {tweet_timestamp}

Current timestamp: {current_timestamp}

Content images in the tweet: {content_images}

List of given facts:
{given_facts}

Responses to evaluate (sorted from earliest to latest):
{answers_content}
"""
