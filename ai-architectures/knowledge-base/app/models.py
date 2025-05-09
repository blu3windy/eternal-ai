from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Any, Dict, Generic, TypeVar, Type
from enum import Enum
import uuid
from pathlib import Path

_generic_type = TypeVar('_generic_type')

class EmbeddedItem(BaseModel):
    embedding: Optional[List[float]] = None
    raw_text: str
    error: Optional[str] = None

class GraphEmbeddedItem(EmbeddedItem):
    head: int
    tail: int
    kb_postfix: str
    
class APIStatus(str, Enum):
    OK = "ok"
    ERROR = "error"

    PENDING = "pending"
    PROCESSING = "processing"

class InsertInputSchema(BaseModel):
    id: str = Field(default_factory=lambda: f"doc-{str(uuid.uuid4().hex)}")
    file_urls: List[str] = []
    texts: List[str] = [] 
    kb: Optional[str] = None
    filecoin_metadata_url: Optional[str] = None

    # ref and kb must not be both None
    ref: Optional[str] = None
    hook: Optional[str] = None

    is_re_submit: bool = False

    @model_validator(mode='before')
    def fill_texts(cls, data: dict):
        if not isinstance(data, dict):
            raise ValueError("Data must be a dictionary")

        if 'texts' not in data:
            data['texts'] = []
            
        if isinstance(data['texts'], str):
            data['texts'] = [data['texts']]

        if data.get('kb', '') == '' and 'ref' not in data:
            raise ValueError("Either a reference or a knowledge base must be provided")

        if data.get('kb', '') == '':
            data['kb'] = 'kb-' + data['ref']

        assert len(data['kb']) > 0, "Knowledge base must not be empty"
        return data
    
class UpdateInputSchema(BaseModel):
    kb: Optional[str]
    id: str = Field(default_factory=lambda: f"doc-{str(uuid.uuid4().hex)}")
    file_urls: List[str] = []
    texts: List[str] = [] 
    filecoin_metadata_url: Optional[str] = None

    # ref and kb must not be both None
    ref: Optional[str] = None
    hook: Optional[str] = None

    is_re_submit: bool = False

    @model_validator(mode='before')
    def fill_texts(cls, data: dict):
        if not isinstance(data, dict):
            raise ValueError("Data must be a dictionary")

        if 'texts' not in data:
            data['texts'] = []
            
        if isinstance(data['texts'], str):
            data['texts'] = [data['texts']]
        
        return data

class CollectionInspection(BaseModel):
    file_ref: str # {cid}/{file_index}
    status: APIStatus = APIStatus.OK
    message: str = ""

class QueryInputSchema(BaseModel):
    query: str
    top_k: int = 1
    kb: List[str] 
    threshold: float = 0.2

    def __hash__(self):
        kbs_str = "".join(sorted(self.kb))
        return hash(f"{self.query}{self.top_k}{self.threshold}{kbs_str}")

    @model_validator(mode='before')
    def fill_kb(cls, data: dict):
        if not isinstance(data, dict):
            raise ValueError("Data must be a dictionary")

        if 'kb' not in data:
            raise ValueError("Knowledge base must be provided")

        if isinstance(data['kb'], str):
            data['kb'] = [data['kb']]
            
        return data

import string

class SimMetric(str, Enum):
    L2 = "L2"
    IP = "IP"
    COSINE = "COSINE"

class EmbeddingModel(BaseModel):
    name: str
    tokenizer: str
    base_url: str
    dimension: int
    prefer_metric: Optional[SimMetric] = SimMetric.COSINE
    normalize: bool = False

    def __hash__(self):
        data = f"{self.name}-{self.dimension}"
        return hash(data)
    
    def identity(self):
        punctuation = string.punctuation.replace("_", "")

        name = self.name.lower()
        for p in punctuation:
            name = name.replace(p, '_')

        return f"{name}_{self.dimension}"

class SearchRequest(BaseModel):
    collection: str
    query: str
    top_k: int = 1
    
    kwargs: Optional[Dict[str, Any]] = None 
    # to store something like filters, metrics, etc. 

class ChunkScore(BaseModel):
    score: float
    chunk_id: str

class ResponseMessage(BaseModel, Generic[_generic_type]):
    result: _generic_type = None
    error: Optional[str] = None
    status: APIStatus = APIStatus.OK
    
    @model_validator(mode="after")
    def refine_status(self):
        if self.error is not None:
            self.status = APIStatus.ERROR
            
        return self

class InsertionCounter(object):
    def __init__(self):
        self.total = 0
        self.fails = 0

class InsertResponse(BaseModel):
    """
    InsertResponse represents the data returned after an artifact insertion operation.

    Attributes:
        ref (str): Reference identifier for the inserted artifact.
        kb (Optional[str]): Knowledge base identifier, if applicable.
        message (Optional[str]): Additional information about the insertion result.
        artifact_submitted (bool): Indicates whether the artifact was successfully submitted.
    """

    ref: str
    kb: str
    message: Optional[str] = ""
    details: List[CollectionInspection] = []

class InsertProgressCallback(BaseModel):
    ref: str
    kb: str
    identifier: str
    message: Optional[str] = ""

class QueryResult(BaseModel):
    content: str
    score: float
    reference: Optional[str] = None
    
class FilecoinData(BaseModel):
    identifier: str
    address: str

    @model_validator(mode='before')
    def validate_address(cls, data: dict):
        if not isinstance(data, dict):
            raise ValueError("Data must be a dictionary")

        if 'address' not in data:
            raise ValueError("Address must be provided")

        if isinstance(data['address'], Path):
            data['address'] = str(data['address'])

        return data