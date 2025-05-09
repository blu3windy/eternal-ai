---
description: Test a dagent created in EternalAI platform by id.
---

# Agent Completion

`POST https://agent.api.eternalai.org/api/agent/{agentId}/chat/completions`



### Request body

**messages** `array` _Required_

* A list of messages comprising the conversation so far.

**`agentId`** `string` _Required_

* ID of the agent.



**store** `boolean or null` _Optional Defaults to false_

* Whether or not to store the output of this chat completion request for use in our model distillation or evals products.

**metadata** `object or null` _Optional_

* Developer-defined tags and values used for filtering completions in the dashboard.

**frequency\_penalty** `number or null` _Optional Defaults to 0_

* Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.

**logit\_bias** `map` _Optional Defaults to null_

* Modify the likelihood of specified tokens appearing in the completion.
* Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.

**logprobs** `boolean or null` _Optional Defaults to false_

* Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`.

**top\_logprobs** `integer or null` _Optional_

* An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used.

**max\_tokens** (Deprecated) `integer or null` _Optional_

* The maximum number of tokens that can be generated in the chat completion. This value can be used to control costs for text generated via API.
* This value is now deprecated in favor of `max_completion_tokens`, and is not compatible with o1 series models.

**max\_completion\_tokens** `integer or null` _Optional_

* An upper bound for the number of tokens that can be generated for a completion, including visible output tokens and reasoning tokens.

**n** `integer or null` _Optional Defaults to 1_

* How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep `n` as `1` to minimize costs.

**modalities** `array or null` _Optional_

* Output types that you would like the model to generate for this request. Most models are capable of generating text, which is the default: `["text"]`

**prediction** `object` _Optional_

* Configuration for a Predicted Output, which can greatly improve response times when large parts of the model response are known ahead of time. This is most common when you are regenerating a file with only minor changes to most of the content.

**audio** `object or null` _Optional \[TODO]_

* Parameters for audio output. Required when audio output is requested with `modalities: ["audio"]`.

**presence\_penalty** `number or null` _Optional Defaults to 0_

* Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

**response\_format** `object` _Optional_

* An object specifying the format that the model must output.
* Setting to `{ "type": "json_schema", "json_schema": {...} }` enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the Structured Outputs guide.
* Setting to `{ "type": "json_object" }` enables JSON mode, which ensures the message the model generates is valid JSON.
* **Important:** when using JSON mode, you **must** also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.

**seed** `integer or null` _Optional_

* This feature is in Beta. If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result. Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend.

**service\_tier** `string or null` _Optional Defaults to auto_

* Specifies the latency tier to use for processing the request. This parameter is relevant for customers subscribed to the scale tier service:
  * If set to 'auto', and the Project is Scale tier enabled, the system will utilize scale tier credits until they are exhausted.
  * If set to 'auto', and the Project is not Scale tier enabled, the request will be processed using the default service tier with a lower uptime SLA and no latency guarentee.
  * If set to 'default', the request will be processed using the default service tier with a lower uptime SLA and no latency guarentee.
  * When not set, the default behavior is 'auto'.
* When this parameter is set, the response body will include the `service_tier` utilized.

**stop** `string / array / null` _Optional Defaults to null_

* Up to 4 sequences where the API will stop generating further tokens.

**stream** `boolean or null` _Optional Defaults to false_

* If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a `data: [DONE]` message.&#x20;

**stream\_options** `object or null` _Optional Defaults to null_

* Options for streaming response. Only set this when you set `stream: true`.

**temperature** `number or null` Optional Defaults to 1

* What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
* We generally recommend altering this or `top_p` but not both.

**top\_p** `number or null` _Optional Defaults to 1_

* An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top\_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
* We generally recommend altering this or `temperature` but not both.

**tools** `array` _Optional_

* A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. A max of 128 functions are supported.

**tool\_choice** `string or object` _Optional_

* Controls which (if any) tool is called by the model. `none` means the model will not call any tool and instead generates a message. `auto` means the model can pick between generating a message or calling one or more tools. `required` means the model must call one or more tools. Specifying a particular tool via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that tool.
* `none` is the default when no tools are present. `auto` is the default if tools are present.

**parallel\_tool\_calls** `boolean` _Optional Defaults to true_

* Whether to enable parallel function calling during tool use.

**user** `string` _Optional_

* A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.&#x20;

**function\_call** (Deprecated) `string or object` _Optional_

* Deprecated in favor of `tool_choice`.
* Controls which (if any) function is called by the model. `none` means the model will not call a function and instead generates a message. `auto` means the model can pick between generating a message or calling a function. Specifying a particular function via `{"name": "my_function"}` forces the model to call that function.
* `none` is the default when no functions are present. `auto` is the default if functions are present.

**functions** (Deprecated) `array` _Optional_

* Deprecated in favor of `tools`.
* A list of functions the model may generate JSON inputs for.

***

### Response body

Represents a chat completion response returned by model, based on the provided input.

**id** `string`

* A unique identifier for the chat completion.

**choices** `array`

* A list of chat completion choices. Can be more than one if `n` is greater than 1.

**created** `integer`

* The Unix timestamp (in seconds) of when the chat completion was created.

**model** `string`

* The model used for the chat completion.

**service\_tier** `string or null`

* The service tier used for processing the request. This field is only included if the `service_tier` parameter is specified in the request.

**system\_fingerprint** `string`

* This fingerprint represents the backend configuration that the model runs with.
* Can be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism.

**object** `string`

* The object type, which is always `chat.completion`.

**usage** `object`

* Usage statistics for the completion request.



### Example request & response

{% hint style="info" %}
The `ETERNALAI_API_KEY` can be obtained by following [the guide](https://docs.eternalai.org/eternal-ai/decentralized-inference-api/api-key)
{% endhint %}

#### Request

```bash
 
curl --location 'https://agent.api.eternalai.org/api/agent/673c7d444531083fee889442/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $ETERNALAI_API_KEY' \
--data '{
    "messages": [
        {
            "role": "user",
            "content": "Hello!"
        }
    ]
}'
```

#### Response

```
{ 
   "id": "chat-7a158eb29d134a07a4447be3a6e7a8d9",
    "object": "chat.completion",
    "created": 1732269931,
    "model": "neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Hello! It's nice to meet you. Is there something I can help you with or would you like to chat?"
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 23,
        "completion_tokens": 25,
        "total_tokens": 48
    }
}
```

