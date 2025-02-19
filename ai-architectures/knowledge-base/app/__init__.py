__version__ = 'v3.0.6'

import logging

logger = logging.getLogger(__name__)

from dotenv import load_dotenv
if not load_dotenv():
    logger.warning("No .env file found")

from . import (
    wrappers, 
)
