FROM ubuntu:20.04
COPY ./eai-chat /app/eternal-ai/eai-chat
RUN cat /app/eternal-ai/eai-chat
COPY config.json /app/eternal-ai/decentralized-inference/config.json
COPY local_contracts.json /app/eternal-ai/decentralized-compute/worker-hub/env/local_contracts.json

# Change the working directory to the desired folder
WORKDIR /app/eternal-ai

# Ensure that the eai-chat executable is present and is marked as executable
RUN chmod +x ./eai-chat

# Run the command
CMD ["./eai-chat", "server"]
