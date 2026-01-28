from abc import ABC, abstractmethod

class AIServiceProvider(ABC):
    @abstractmethod
    async def summarize_text(self, texts: list[str]) -> str:
        """Summarize a list of audience answers."""
        pass

    @abstractmethod
    async def analyze_sentiment(self, text: str) -> str:
        """Return Positive, Neutral, or Negative."""
        pass