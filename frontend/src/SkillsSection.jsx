const categories = [
  ["Core Skills", "core"],
  ["Languages", "languages"],
  ["Frameworks", "frameworks"],
  ["Tools", "tools"],
  ["Soft Skills", "soft"],
  ["Advanced", "advanced"],
];

export default function SkillsSection({ skills }) {
  if (!skills) return null;

  return (
    <div className="space-y-8">
      {categories.map(([title, key]) => (
        <div key={key}>
          <h3 className="text-lg font-bold mb-4">{title}</h3>

          <div className="flex flex-wrap gap-3">
            {skills[key]?.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white transition-all duration-300 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}