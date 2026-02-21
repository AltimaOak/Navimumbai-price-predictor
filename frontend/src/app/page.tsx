"use client";

import { useState } from "react";

import { predict } from "@/lib/api";

export default function Home() {
  const [model, setModel] = useState("dummy");
  const [featureA, setFeatureA] = useState("");
  const [featureB, setFeatureB] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setResult("");

    const features: Record<string, number> = {};
    const parsedA = Number(featureA);
    const parsedB = Number(featureB);

    if (featureA.trim() !== "" && !Number.isNaN(parsedA)) {
      features.featureA = parsedA;
    }

    if (featureB.trim() !== "" && !Number.isNaN(parsedB)) {
      features.featureB = parsedB;
    }

    try {
      const response = await predict({
        model,
        features,
      });
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            ML Prediction Starter
          </h1>
          <p className="text-base text-zinc-600">
            Send inputs to the FastAPI backend at
            <span className="font-medium"> http://localhost:8000/predict</span>.
            The dummy model returns the sum of numeric features.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Model key
              <input
                className="h-11 rounded-lg border border-zinc-200 px-3 text-base"
                value={model}
                onChange={(event) => setModel(event.target.value)}
                placeholder="dummy"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Feature A
              <input
                className="h-11 rounded-lg border border-zinc-200 px-3 text-base"
                inputMode="decimal"
                value={featureA}
                onChange={(event) => setFeatureA(event.target.value)}
                placeholder="10"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Feature B
              <input
                className="h-11 rounded-lg border border-zinc-200 px-3 text-base"
                inputMode="decimal"
                value={featureB}
                onChange={(event) => setFeatureB(event.target.value)}
                placeholder="5"
              />
            </label>
            <button
              className="h-11 rounded-lg bg-black text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? "Predicting..." : "Run Prediction"}
            </button>
          </div>
        </section>

        {(error || result) && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-zinc-700">
                {result}
              </pre>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
