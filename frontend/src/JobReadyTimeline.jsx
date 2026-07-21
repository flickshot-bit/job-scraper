const stages = [
  ["🎓 Internship Ready", "internship_ready"],
  ["💻 Freelance Ready", "freelance_ready"],
  ["🚀 Job Ready", "job_ready"],
];

export default function JobReadyTimeline({ timeline }) {
  if (!timeline) return null;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {stages.map(([title, key]) => {
        const item = timeline[key];

        return (
          <div
            key={key}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-xl font-bold mb-2">
              {title}
            </h2>

            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm mb-5">
              {item.duration}
            </span>

            <ul className="space-y-3">
              {item.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex gap-3"
                >
                  <span className="text-green-600">✓</span>

                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}