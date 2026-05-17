import { useEffect, useState } from "react";

const Inventory = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/auth/me", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((user) => {
        return fetch(`http://localhost:8080/inventory/${user.id}`, {
          credentials: "include",
        });
      })
      .then((r) => r.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">Inventory</h1>

      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-zinc-900 rounded-xl p-4">
            <img
              src={"http://localhost:8080" + item.skin.imageUrl}
              alt={item.skin.name}
              className="w-full h-40 object-contain"
            />

            <h2 className="mt-4 font-bold">{item.skin.name}</h2>

            <p className="text-zinc-400">{item.skin.price} zł</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
