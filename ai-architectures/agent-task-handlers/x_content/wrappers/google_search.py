import json
from typing import List
from venv import logger
from langchain_google_community import GoogleSearchAPIWrapper
import requests

from x_content.wrappers.log_decorators import log_function_call


@log_function_call
def web_search_from_google(query: str, top_k: int = 1) -> List[str]:
    """
    Retrieves search result from web using google custome search engine.

    Args:
        query (str): The search query to retrieve insights for.
        top_k (int): The number of top search results to retrieve.

    Returns:
        str: A consolidated summary of insights derived from the search results.
    """

    try:
        # Initialize the search wrapper
        search = GoogleSearchAPIWrapper()

        # Perform a search query
        results = search.results(query, num_results=top_k)

        descriptions = [item.get("snippet", "") for item in results]
        final_content = descriptions if descriptions else []
        return final_content
    except requests.exceptions.RequestException as e:
        logger.error(f"[web_search_from_google] Request failed: {e}")
        return []

    except json.JSONDecodeError as e:
        logger.error(f"[web_search_from_google] JSON decode error: {e}")
        return []

    except Exception as e:
        logger.error(
            f"[web_search_from_google] An unexpected error occurred: {e}"
        )
        return []
