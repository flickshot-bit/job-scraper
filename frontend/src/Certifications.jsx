export default function Certifications({ certifications }) {
  if (!certifications) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {certifications.map((cert) => (
        <div
          key={cert.name}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex justify-between items-start">

            <h2 className="text-lg font-bold">
              {cert.name}
            </h2>

            {cert.recommended && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                ⭐ Recommended
              </span>
            )}

          </div>

          <p className="text-gray-500 mt-2">
            {cert.provider}
          </p>

          <span className="inline-block mt-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            {cert.level}
          </span>

          <p className="mt-5 text-gray-600 leading-7">
            {cert.reason}
          </p>

        </div>
      ))}
    </div>
  );
}