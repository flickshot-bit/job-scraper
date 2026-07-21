export default function CareerSnapshot({ snapshot }) {
  if (!snapshot) return null;

  const icons = ["💼", "🏢", "🎯", "🌍"];

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {snapshot.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="text-3xl mb-4">{icons[index] || "✨"}</div>

          <p className="text-gray-700 leading-7">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}