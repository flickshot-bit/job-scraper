const levels = [
  ["🟢 Beginner", "beginner"],
  ["🟡 Intermediate", "intermediate"],
  ["🔴 Advanced", "advanced"],
];

export default function ProjectsSection({ projects }) {
  if (!projects) return null;

  return (
    <div className="space-y-10">
      {levels.map(([title, key]) => (
        <div key={key}>
          <h2 className="text-xl font-bold mb-5">{title}</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {projects[key]?.map((project) => (
              <div
                key={project.title}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold">
                  {project.title}
                </h3>

                <p className="text-gray-600 mt-3 leading-7">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-slate-100 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}