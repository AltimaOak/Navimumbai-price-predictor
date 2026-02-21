export type PredictionPayload = {
  model?: string;
  features: Record<string, unknown>;
};

export type PredictionResult = {
  model: string;
  prediction: unknown;
  details?: Record<string, unknown>;
};

export async function predict(
  payload: PredictionPayload
): Promise<PredictionResult> {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: payload.model ?? "dummy",
      features: payload.features ?? {},
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Prediction failed (${response.status}): ${text || response.statusText}`
    );
  }

  return response.json();
}
