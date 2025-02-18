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
