# Vibe - AI Agent Platform 🤖

Vibe is a platform that allows developers to run their AI agents in a containerized environment. This platform provides a standardized way to expose AI agent APIs and integrate with local language models. You can implement your AI agent in any programming language that can handle HTTP requests.

## 🌟 Features

- **Language Agnostic**: Build agents in any programming language
- **Containerized**: Secure and isolated agent execution
- **Local Model Support**: Easy integration with local language models
- **Easy Deployment**: Quick setup with Docker

## 🚀 Getting Started

### Prerequisites

- Docker installed on your system
- Source code for your AI agent
- Basic knowledge of REST APIs

### Quick Start

1. Create your AI agent implementation
2. Add a Dockerfile
3. Build and run your container
4. Test your agent's API endpoints

## 📁 Project Structure

```
my-ai-agent/
├── Dockerfile # Container configuration
├── src/ # Your agent's source code
│ └── main.(js|py|go) # Main application file
└── requirements.txt # Dependencies (if needed)
```


### 1. API Endpoint Requirements

Your agent MUST implement:
- Endpoint: `POST /prompt`
- Port: `80`
- Response Format: JSON result: string

### 2. Request/Response Format

#### Request Format
```json
{
    "ping": true, # Optional, for health check
    "messages": [
        {
            "role": "user",
            "content": "your prompt"
        }
    ],
    "privateKey": "0x1234", # If needed
    "chainId": "1"
}
```

#### Response Format
Health check response (`ping: true`):
```string
"online"
```

Normal prompt response:
```json
{
    "result": "AI agent response"
}
```

### 3. Local Model Integration
Local model endpoint:

http://localmodel:8080/v1/chat/completions

Request format:
```json
{
    "messages": [
        {
            "role": "user",
            "content": "your prompt"
        }
    ],
    "privateKey": "0x1234", # If needed
    "chainId": "1"
}
```

### 3. Access Another Agents Integration
Base URL format:
`http://localhost:33030/<chain-id>-<agent-name>/prompt`

**Important Notes:**
- `chain-id`: Must be in lowercase (e.g., "84532", "1")
- `agent-name`: Must be in lowercase (e.g., "deepsearch", "calculator")
- No uppercase letters allowed in the URL

Examples:

✅ Correct:

```
http://localhost:33030/84532-deepsearch/prompt
http://localhost:33030/1-calculator/prompt
```
❌ Incorrect:
```angular2html
http://localhost:33030/84532-DeepSearch/prompt // Contains uppercase
http://localhost:33030/84532-CALCULATOR/prompt // Contains uppercase
```

Request format:
```json
{
    "messages": [
        {
            "role": "user",
            "content": "your prompt"
        }
    ]
}
```

## ✅ Requirements Checklist

1. API Implementation
   - [ ] POST /prompt endpoint
   - [ ] Port 80
   - [ ] Correct request/response format
   - [ ] Error handling

2. Docker Configuration
   - [ ] Correct base image
   - [ ] Dependencies installation
   - [ ] Security considerations

3. Testing
   - [ ] Health check works
   - [ ] Prompt handling works
   - [ ] Error cases handled