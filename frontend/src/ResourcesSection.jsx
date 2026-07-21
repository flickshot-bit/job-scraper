const categories = [
  ["📺 YouTube", "youtube"],
  ["📄 Documentation", "documentation"],
  ["🎓 Platforms", "platforms"],
  ["📚 Books", "books"],
];

export default function ResourcesSection({ resources }) {
  if (!resources) return null;

  return (
    <div className="space-y-10">
      {categories.map(([title, key]) => (
        <div key={key}>
          <h2 className="text-xl font-bold mb-5">
            {title}
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {resources[key]?.map((item) => (
              <div
                key={item.name}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="text-lg font-semibold">
                  {item.name}
                </h3>

                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline break-all mt-2 block"
                  >
                    Visit Documentation
                  </a>
                ) : (
                  <p className="text-gray-600 mt-3 leading-7">
                    {item.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}