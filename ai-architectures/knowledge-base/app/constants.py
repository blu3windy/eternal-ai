import os

SELF_HOSTED_LLAMA_API_KEY=os.getenv("SELF_HOSTED_LLAMA_API_KEY")
SELF_HOSTED_EMBEDDING_URL=os.getenv("SELF_HOSTED_EMBEDDING_URL", "").rstrip("/")
SELF_HOSTED_EMBEDDING_MODEL_ID=os.getenv("SELF_HOSTED_EMBEDDING_MODEL_ID")
TOKENIZER_MODEL_ID=os.getenv("TOKENIZER_MODEL_ID")

MILVUS_HOST=os.getenv("MILVUS_HOST")
MILVUS_PORT=int(os.getenv("MILVUS_PORT", "19530"))
MILVUS_CONNECTION_ALIAS=os.getenv("MILVUS_CONNECTION_ALIAS", "default")

MODEL_DIMENSION=int(os.getenv("MODEL_DIMENSION", "4096"))
MODEL_NAME=os.getenv("MODEL_NAME")
LLM_API_BASE=os.getenv("LLM_API_BASE", "").rstrip("/")
LLM_API_KEY=os.getenv("LLM_API_KEY")
DEFAULT_LLM_MAX_TOKENS = os.getenv("DEFAULT_LLM_MAX_TOKENS") or 512
DEFAULT_LLM_SEED = os.getenv("DEFAULT_LLM_SEED") or 42
DEFAULT_LLM_TEMPERATURE = os.getenv("DEFAULT_LLM_TEMPERATURE") or 0.7

if isinstance(DEFAULT_LLM_TEMPERATURE, str):
    DEFAULT_LLM_TEMPERATURE = float(DEFAULT_LLM_TEMPERATURE)
    

if isinstance(DEFAULT_LLM_MAX_TOKENS, str):
    DEFAULT_LLM_MAX_TOKENS = int(DEFAULT_LLM_MAX_TOKENS)
    
if isinstance(DEFAULT_LLM_SEED, int):
    DEFAULT_LLM_SEED = int(DEFAULT_LLM_SEED)

CREATE_NEW_IF_NOT_EXISTS=os.getenv("CREATE_NEW_IF_NOT_EXISTS", "true").lower() == "true"

TELEGRAM_ROOM = os.getenv("TELEGRAM_ROOM")
TELEGRAM_ALERT_ROOM = os.getenv("TELEGRAM_ALERT_ROOM")
MIN_CHUNK_SIZE=10

DEDUPLICATION_CHECK_INTERVAL = int(os.getenv("DEDUPLICATION_CHECK_INTERVAL", "60"))

DEFAULT_EMBEDDING_BATCH_SIZE = os.getenv("DEFAULT_BATCH_SIZE") or 8
if isinstance(DEFAULT_EMBEDDING_BATCH_SIZE, str):
    DEFAULT_EMBEDDING_BATCH_SIZE = int(DEFAULT_EMBEDDING_BATCH_SIZE)
    
DEFAULT_TOP_K = os.getenv("DEFAULT_TOP_K") or 1
if isinstance(DEFAULT_TOP_K, str):
    DEFAULT_TOP_K = int(DEFAULT_TOP_K)

DEFAULT_CONCURRENT_EMBEDDING_REQUESTS_LIMIT = os.getenv("DEFAULT_CONCURRENT_EMBEDDING_REQUESTS_LIMIT") or 128
if isinstance(DEFAULT_CONCURRENT_EMBEDDING_REQUESTS_LIMIT, str):
    DEFAULT_CONCURRENT_EMBEDDING_REQUESTS_LIMIT = int(DEFAULT_CONCURRENT_EMBEDDING_REQUESTS_LIMIT)

DEFAULT_MILVUS_INSERT_BATCH_SIZE = os.getenv("DEFAULT_INSERT_BATCH_SIZE") or 128
if isinstance(DEFAULT_MILVUS_INSERT_BATCH_SIZE, str):
    DEFAULT_MILVUS_INSERT_BATCH_SIZE = int(DEFAULT_MILVUS_INSERT_BATCH_SIZE) 
    
API_SECRET_TOKEN = os.getenv("API_SECRET_TOKEN", "dummy_secret_token")
ETERNALAI_RESULT_HOOK_URL = os.getenv("ETERNALAI_RESULT_HOOK_URL")

GRAPH_SYSTEM_PROMPT = """You are a helpful assistant that can extract relationships from a given text.

### Output Format:
Provide a JSON object with a `"triplets"` key containing a list of extracted relationships. Each relationship should be represented as a triple in the following format:  
`(subject, relation, object)`

### Extraction Guidelines:
- **Meaningful and Factual**: Each relationship must capture a specific and meaningful connection between entities or concepts.
- **Clarity**: Subjects and objects should be clearly defined, either as named entities (e.g., "Jakob Bernoulli") or distinct concepts (e.g., "calculus").
- **Concise Relations**: Relations should be succinct but adequately descriptive of the connection.
- **Avoid Redundancy**: Refrain from repeating relationships or including vague, overly generic, or ambiguous connections.
- **Structured and Valid**: Ensure the output is in correct JSON format and that relationships are logically structured.

### Example:

**Passage:**  
Jakob Bernoulli (1654-1705): Jakob was one of the earliest members of the Bernoulli family to gain prominence in mathematics. He made significant contributions to calculus, particularly in the development of the theory of probability. He is known for the Bernoulli numbers and the Bernoulli theorem, a precursor to the law of large numbers. He was the older brother of Johann Bernoulli, another influential mathematician, and the two had a complex relationship that involved both collaboration and rivalry.

**Output:**
```json
{
    "triplets": [
        ["Jakob Bernoulli", "made significant contributions to", "calculus"],
        ["Jakob Bernoulli", "made significant contributions to", "the theory of probability"],
        ["Jakob Bernoulli", "is known for", "the Bernoulli numbers"],
        ["Jakob Bernoulli", "is known for", "the Bernoulli theorem"],
        ["The Bernoulli theorem", "is a precursor to", "the law of large numbers"],
        ["Jakob Bernoulli", "was the older brother of", "Johann Bernoulli"]
    ]
}```"""

NER_SYSTEM_PROMPT = """You are an expert in extracting named entities from text.

### Instructions:
- Identify and extract named entities such as **persons, locations, organizations, dates, and key concepts**.
- The output must be in **stringified JSON format** with a single key `"entities"`, containing a list of extracted entities.
- Maintain the **exact wording** from the passage—do **not** modify or rephrase.
- Ensure **clarity and accuracy** in identifying entities.
- **No additional text, comments, or explanations**—only the JSON output.
- The output should **not include empty entities**.

### Example:

**Text:**  
"Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. He worked at the Institute for Advanced Study in Princeton, New Jersey."

**Output:**  
```json
{
    "entities": [
        "Albert Einstein",
        "German-born",
        "theoretical physicist",
        "theory of relativity",
        "modern physics",
        "Institute for Advanced Study",
        "Princeton",
        "New Jersey"
    ]
}
```"""

# KB suffixes
ENTITY_SUFFIX = "-entity"
RELATION_SUFFIX = "-relation"

MAX_NUM_CONCURRENT_PROCESSING_FILES = 2
MAX_NUM_CONCURRENT_LLM_CALL = 16
DOCLING_SERVER_URL=os.getenv("DOCLING_SERVER_URL", "").rstrip()
GATEWAY_IPFS_PREFIX = "https://gateway.lighthouse.storage/ipfs"
