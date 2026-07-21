export default function BeginnerMistakes({ mistakes }) {
  if (!mistakes) return null;

  return (
    <div className="space-y-6">
      {mistakes.map((item, index) => (
        <div
          key={index}
          className="border border-yellow-200 bg-yellow-50 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 className="text-xl font-bold text-yellow-800 mb-4">
            ⚠️ {item.mistake}
          </h2>

          <div className="mb-4">
            <h3 className="font-semibold text-red-600 mb-2">
              📉 Impact
            </h3>

            <p className="text-gray-700">
              {item.impact}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-green-700 mb-2">
              ✅ Solution
            </h3>

            <p className="text-gray-700">
              {item.solution}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}