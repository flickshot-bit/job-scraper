export default function SectionCard({
  title,
  icon,
  children
}) {

  return (

    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-6">

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">

        <span className="text-3xl">
          {icon}
        </span>

        {title}

      </h2>

      {children}

    </div>

  );
}