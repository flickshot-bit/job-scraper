export default function CareerOpportunities({ opportunities }) {
  if (!opportunities) return null;

  return (
    <div className="space-y-10">

      <div>
        <h2 className="text-xl font-bold mb-5">
          💼 Job Roles
        </h2>

        <div className="flex flex-wrap gap-3">
          {opportunities.job_roles?.map((role) => (
            <span
              key={role}
              className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-5">
          🏭 Industries
        </h2>

        <div className="flex flex-wrap gap-3">
          {opportunities.industries?.map((industry) => (
            <span
              key={industry}
              className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium"
            >
              {industry}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}