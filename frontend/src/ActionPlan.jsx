const months = [
  ["Month 1", "month1"],
  ["Month 2", "month2"],
  ["Month 3", "month3"],
];

export default function ActionPlan({ plan }) {
  if (!plan) return null;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {months.map(([label, key]) => {
        const item = plan[key];

        return (
          <div
            key={key}
            className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-lg"
          >
            <span className="text-sm text-slate-300">
              {label}
            </span>

            <h2 className="text-2xl font-bold mt-2">
              {item.title}
            </h2>

            <ul className="mt-6 space-y-3">
              {item.goals.map((goal, index) => (
                <li
                  key={index}
                  className="flex gap-3"
                >
                  <span>✅</span>

                  <span className="text-slate-300">
                    {goal}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}