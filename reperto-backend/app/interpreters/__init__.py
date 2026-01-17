"""
Dual interpretation engines
- OpenAI: Advanced semantic understanding
- Local: Deterministic, explainable analysis
"""

from .openai_engine import OpenAIEngine
from .local_engine import LocalEngine

__all__ = ["OpenAIEngine", "LocalEngine"]
