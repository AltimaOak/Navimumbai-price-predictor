export type PredictionPayload = {
  model?: string;
  features: Record<string, unknown>;
};

export type PredictionResult = {
  model: string;
  prediction: unknown;
  details?: Record<string, unknown>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pravah-template.onrender.com";

export async function predict(
  payload: PredictionPayload
): Promise<PredictionResult> {
  console.log("Calling API:", `${API_URL}/predict`, "Payload:", payload);
  const response = await fetch(`${API_URL}/predict`, {
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
    console.error("API Error Result:", text);
    throw new Error(
      `Prediction failed (${response.status}): ${text || response.statusText}`
    );
  }

  const result = await response.json();
  console.log("API Success Response:", result);
  return result;
}

// Real Estate specific types and functions
export type RealEstateRequest = {
  location: "Vashi" | "Nerul" | "Kharghar" | "Panvel";
  area: number;
  bhk: number;
  bathrooms: number;
  age: number;
  parking: boolean;
};

export type RealEstateResponse = {
  predicted_price: number;
  price_per_sqft: number;
  market_status: string;
};

export async function predictRealEstate(
  payload: RealEstateRequest
): Promise<RealEstateResponse> {
  console.log("Calling Real Estate API:", `${API_URL}/predict/real-estate`, "Payload:", payload);
  try {
    const response = await fetch(`${API_URL}/predict/real-estate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("API Error Result:", text);
      throw new Error(
        `Real estate prediction failed (${response.status}): ${text || response.statusText}`
      );
    }

    const result = await response.json();
    console.log("API Success Response:", result);
    return result;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}
