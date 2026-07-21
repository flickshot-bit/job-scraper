export default function LearningRoadmap({ roadmap }) {
  if (!roadmap) return null;

  return (
    <div className="relative border-l-2 border-blue-200 ml-4 space-y-8">
      {roadmap.map((step) => (
        <div key={step.step} className="relative pl-8">

          <div className="absolute -left-4 top-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg">
            {step.step}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex justify-between items-center">

              <h3 className="text-xl font-bold">
                {step.title}
              </h3>

              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {step.duration}
              </span>

            </div>

            <p className="mt-4 text-gray-600 leading-7">
              {step.description}
            </p>

          </div>

        </div>
      ))}
    </div>
  );
}