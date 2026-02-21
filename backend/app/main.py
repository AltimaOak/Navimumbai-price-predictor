from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .model.predictor import predictor
from .schemas import PredictionRequest, PredictionResponse

app = FastAPI(title="Prediction API", version="0.1.0")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    try:
        result = predictor.predict(payload.model, payload.features)
    except KeyError:
        raise HTTPException(status_code=400, detail=f"Unknown model '{payload.model}'.")
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    return PredictionResponse(
        model=payload.model,
        prediction=result,
        details={"input_features": payload.features},
    )
