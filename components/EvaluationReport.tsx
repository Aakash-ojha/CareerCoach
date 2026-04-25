"use client";

export default function EvaluationReport({ report, onReset }: any) {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl text-center">
        <div className="text-6xl font-black text-blue-500 mb-2">
          {report.score}%
        </div>
        <p className="text-neutral-400 uppercase tracking-widest text-sm mb-8">
          Performance Score
        </p>

        <div className="text-left space-y-6">
          <div>
            <h4 className="text-green-400 font-bold">Strengths</h4>
            <ul className="list-disc list-inside text-neutral-300">
              {report.strengths?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-red-400 font-bold">Areas to Improve</h4>
            <p className="text-neutral-300">{report.feedback}</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="mt-10 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition"
        >
          Try Another Topic
        </button>
      </div>
    </div>
  );
}
