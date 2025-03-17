# define a prompt fn here or match your code logic to the prompt fn from swhere
from typing import List, Dict

def prompt(messages: List[Dict[str, str]], **kwargs) -> str:
    return f"This is default response by the agent template. Received {messages!r}; Additional args: {kwargs}"