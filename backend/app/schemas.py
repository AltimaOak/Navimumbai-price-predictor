from typing import Any, Dict

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    model: str = Field(default="dummy", description="Model key to use")
    features: Dict[str, Any] = Field(default_factory=dict)


class PredictionResponse(BaseModel):
    model: str
    prediction: Any
    details: Dict[str, Any] = Field(default_factory=dict)
