import ReactMarkdown from "react-markdown";

import CareerHeader from "./CareerHeader";
import SectionCard from "./SectionCard";

export default function CareerReport({
  roadmap,
  showFullRoadmap,
  setShowFullRoadmap,
  role
}) {

  return (

    <>

      <CareerHeader title={role} />

      <SectionCard
        icon="📄"
        title="Career Intelligence Report"
      >

        {!showFullRoadmap ? (

          <>

            <div className="max-h-96 overflow-hidden leading-8">

              <ReactMarkdown>
                {roadmap}
              </ReactMarkdown>

            </div>

            <button
              onClick={() => setShowFullRoadmap(true)}
              className="mt-6 rounded-xl border px-5 py-3 hover:shadow-md transition"
            >
              Show Full Report
            </button>

          </>

        ) : (

          <>

            <div className="leading-8">

              <ReactMarkdown>
                {roadmap}
              </ReactMarkdown>

            </div>

            <button
              onClick={() => setShowFullRoadmap(false)}
              className="mt-6 rounded-xl border px-5 py-3 hover:shadow-md transition"
            >
              Hide Report
            </button>

          </>

        )}

      </SectionCard>

    </>

  );

}