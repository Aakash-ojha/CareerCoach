"use client";

export default function EvaluationReport({ report, onReset }: any) {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 text-center">
        <div className="mb-2 text-6xl font-black text-blue-500">
          {report.score}%
        </div>
        <p className="mb-8 text-sm tracking-widest text-neutral-400 uppercase">
          Performance Score
        </p>

        <div className="space-y-6 text-left">
          <div>
            <h4 className="font-bold text-green-400">Strengths</h4>
            <ul className="list-inside list-disc text-neutral-300">
              {report.strengths?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-red-400">Areas to Improve</h4>
            <p className="text-neutral-300">{report.feedback}</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="mt-10 w-full rounded-xl bg-white py-3 font-bold text-black transition hover:bg-neutral-200"
        >
          Try Another Topic
        </button>
      </div>
    </div>
  );
}
