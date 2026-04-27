import { Link } from "react-router-dom";

const CASES = [
  { id: "1", name: "AWP" },
  { id: "2", name: "GLOVES" },
  { id: "3", name: "KNIFE" },
  { id: "4", name: "M4A4" },
];

const Cases = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-w-screen">
      {CASES.map((c) => (
        <Link
          to={`/case/${c.id}/${c.name}`}
          key={c.id}
          className="border border-gray-500 h-80 w-80 sm:h-70 sm:w-70 md:h-60 md:w-60 lg:h-62 lg:w-62 xl:h-60 xl:w-60
            flex justify-center pb-5 items-end mx-auto mb-4 rounded-2xl
            hover:border-green-500 transition-all duration-300"
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
};

export default Cases;
