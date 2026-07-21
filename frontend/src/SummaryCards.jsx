export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      title: "Demand",
      value: summary.demand,
      icon: "📈",
    },
    {
      title: "Growth",
      value: summary.growth,
      icon: "🚀",
    },
    {
      title: "Remote",
      value: summary.remote,
      icon: "🌍",
    },
    {
      title: "Fresher Salary",
      value: summary.salary.fresher,
      icon: "💰",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="text-3xl mb-4">{card.icon}</div>

          <p className="text-gray-500 text-sm">{card.title}</p>

          <h2 className="text-2xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}