import asyncio
from fact_check import TavilyVerificationSource, SearchResponse


async def main():
    # TODO: remove this
    # Initialize Tavily source
    tavily_source = TavilyVerificationSource("")

    # Example claim to search
    query = "what is the result of barcelona and rayo match?"

    # Perform search
    response: SearchResponse = await tavily_source.search(query)

    print("\nTavily Search Results:")
    print(f"Query: {response.query}")
    print(f"Metadata: {response.metadata}")
    print(f"\nResults:{response.results}")


if __name__ == "__main__":
    asyncio.run(main())
