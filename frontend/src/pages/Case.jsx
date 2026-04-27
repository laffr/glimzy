import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Case = () => {
  const { name } = useParams();

  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:8080/api/skins")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter(
          (skin) => skin.weapon.toUpperCase() === name.toUpperCase(),
        );
        setSkins(filtered);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      });
  }, [name]);

  if (error) return <h1 className="text-red-400 p-10">Błąd: {error}</h1>;

  if (!loading && !skins.length)
    return <h1 className="text-white p-10">Brak skinów dla: {name}</h1>;

  return (
    <div className="bg-[#15171C] min-h-screen p-10">
      <h1 className="text-white text-3xl mb-8">{name}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#1c1f26] p-4 rounded-xl animate-pulse"
              >
                <div className="w-full h-40 bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
              </div>
            ))
          : skins.map((skin) => (
              <div
                key={skin.id}
                className="bg-[#15171C] p-4 rounded-xl hover:scale-105 transition"
              >
                <img
                  src={"http://localhost:8080" + skin.imageUrl}
                  alt={skin.name}
                  className="w-full h-40 object-contain rounded"
                />
                <h2 className="text-white mt-3 text-center">{skin.name}</h2>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Case;
