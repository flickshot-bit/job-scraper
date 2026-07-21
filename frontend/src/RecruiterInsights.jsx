const sections = [
  ["👀 What Recruiters Look For", "what_recruiters_look_for"],
  ["💼 Portfolio Tips", "portfolio_tips"],
  ["📄 Resume Tips", "resume_tips"],
  ["🎤 Interview Tips", "interview_tips"],
];

export default function RecruiterInsights({ recruiter }) {
  if (!recruiter) return null;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {sections.map(([title, key]) => (
        <div
          key={key}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 className="text-xl font-bold mb-4">
            {title}
          </h2>

          <ul className="space-y-3">
            {recruiter[key]?.map((item, index) => (
              <li
                key={index}
                className="flex gap-3"
              >
                <span className="text-green-600 font-bold">
                  ✓
                </span>

                <span className="text-gray-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}