import json
from typing import Optional, Protocol, List, Dict
from abc import ABC, abstractmethod
from tavily import TavilyClient
from dataclasses import dataclass
from x_content.llm.base import OnchainInferResult
import os

from x_content.wrappers.llm_tasks import extract_content_relevant_to_query
from x_content.wrappers.magic import sync2async


@dataclass
class SearchResponse:
    """Structured response from fact verification search"""

    query: str
    results: str
    metadata: Dict


class FactVerificationSource(ABC):
    """Abstract base class for fact verification sources"""

    @abstractmethod
    async def search(self, query: str) -> SearchResponse:
        """Search for information related to a query

        Args:
            query: The search query

        Returns:
            SearchResponse object containing:
                query (str): Original search query
                results (List[dict]): List of search results
                metadata (dict): Additional source-specific metadata
        """
        pass


class TavilyVerificationSource(FactVerificationSource):
    """Tavily implementation of fact verification source"""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize Tavily client with API key from env or parameter

        Raises:
            ValueError: If no API key is provided and TAVILY_API_KEY env var is not set
        """

        self.api_key = api_key or os.getenv("TAVILY_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Tavily API key not found. Please set TAVILY_API_KEY environment variable "
                "or pass api_key parameter."
            )

        self.client = TavilyClient(api_key=self.api_key)

    async def search(
        self,
        query: str,
        time_range="d",
        include_answer="basic",
        **kwargs,
    ) -> SearchResponse:
        search_results = self.client.search(
            query=query,
            time_range=time_range,
            include_answer=include_answer,
            **kwargs,
        )

        metadata = {
            "source": "tavily",
            "time_range": time_range,
            "include_answer": include_answer,
        }
        metadata.update(kwargs)

        return SearchResponse(
            query=query,
            results=search_results.get("answer", "N/A"),
            metadata=metadata,
        )

    async def search_with_threshold(
        self,
        query: str,
        time_range="d",
        score_threshold=0.5,
        **kwargs,
    ) -> SearchResponse:
        search_results = self.client.search(
            query=query,
            time_range=time_range,
            **kwargs,
        )

        metadata = {
            "source": "tavily",
            "time_range": time_range,
        }
        metadata.update(kwargs)

        results = search_results.get("results", [])

        results = [x for x in results if x["score"] >= score_threshold]
        contents = [x.get("content", "") for x in results]

        if len(contents) > 0:
            summarized_content = await sync2async(
                extract_content_relevant_to_query
            )(query, contents)
        else:
            summarized_content = ""

        return SearchResponse(
            query=query,
            results=summarized_content,
            metadata=metadata,
        )


class FactCheckService:
    """Service for fact checking claims using third party search and verification services"""

    def __init__(self, verification_source: FactVerificationSource):
        """Initialize the fact checking service

        Args:
            verification_source: Source to use for fact verification
        """
        self.verification_source = verification_source

    async def verify_claim(self, claim: str, llm) -> dict:
        """Verify a claim by searching for supporting evidence

        Args:
            claim: The claim to verify
            llm: LLM instance to help analyze search results

        Returns:
            dict containing:
                verified (bool): Whether claim appears to be true
                confidence (float): Confidence score 0-1
                evidence (list): Supporting evidence found
                sources (list): Source URLs
        """
        # Search for information related to claim
        search_results = await self.verification_source.search(claim)

        # Have LLM analyze results and assess claim
        analysis_prompt = f"""Based on the following search results, analyze whether this claim appears to be true:
Claim: {claim}

Search Results:
{search_results}

Provide your analysis in JSON format with these fields:
- verified: boolean indicating if claim appears true
- confidence: float 0-1 indicating confidence level
- evidence: list of key supporting evidence
- sources: list of source URLs
"""

        analysis_response: OnchainInferResult = await llm.agenerate(
            analysis_prompt, temperature=0.7
        )

        return analysis_response

    async def fact_check_text(self, text: str, llm) -> dict:
        """Extract and verify factual claims from a text passage

        Args:
            text: Text passage to analyze
            llm: LLM instance to help extract and verify claims

        Returns:
            dict containing analysis of factual claims and their verification
        """
        # Have LLM extract factual claims
        extract_prompt = f"""Extract the key factual claims from this text that should be verified:
{text}

List each distinct claim that can be fact checked."""

        claims = await llm.agenerate(extract_prompt, temperature=0.7)

        # Verify each claim
        results = {}
        for claim in claims:
            results[claim] = await self.verify_claim(claim, llm)

        return {
            "text": text,
            "claims": claims,
            "verification_results": results,
        }
