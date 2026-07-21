export default function CareerHeader({ title }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-xl mb-8">

      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>
          <p className="text-gray-300 uppercase tracking-widest text-sm mb-2">
            AI Career Report
          </p>

          <h1 className="text-4xl font-bold">
            🚀 {title || "Career Report"}
          </h1>

          <p className="text-gray-300 mt-3 max-w-2xl">
            Personalized career insights, learning roadmap,
            market trends and recruiter guidance generated
            using AI.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">

          <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
            ✓ AI Generated
          </span>

          <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
            Career Intelligence
          </span>

        </div>

      </div>

    </div>
  );
}