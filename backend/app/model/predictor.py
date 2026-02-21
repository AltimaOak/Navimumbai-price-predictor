from typing import Any, Callable, Dict


class Predictor:
    def __init__(self) -> None:
        self._models: Dict[str, Callable[[Dict[str, Any]], Any]] = {}

    def register(self, name: str, fn: Callable[[Dict[str, Any]], Any]) -> None:
        if not name:
            raise ValueError("Model name is required.")
        self._models[name] = fn

    def predict(self, name: str, features: Dict[str, Any]) -> Any:
        if name not in self._models:
            raise KeyError(name)
        return self._models[name](features)


def dummy_predict(features: Dict[str, Any]) -> Dict[str, Any]:
    numeric_values = [
        value for value in features.values() if isinstance(value, (int, float))
    ]
    if not numeric_values:
        return {"value": 0, "message": "No numeric features provided."}

    score = sum(numeric_values)
    return {
        "value": score,
        "message": "Dummy prediction is the sum of numeric features.",
    }


# Register default models here.
predictor = Predictor()
predictor.register("dummy", dummy_predict)
