import { useEffect, useState } from "react";

const THEME = {
  bg: "#020f1c",
  card: "#042236",
  border: "rgba(56,189,248,0.18)",
  text: "#e0f2fe",
  muted: "#7ab8d4",
  accent: "#38bdf8",
};

const Trader = () => {
  const [users, setUsers] = useState([]);
  const [steamProfiles, setSteamProfiles] = useState({});
  const [selectedInventory, setSelectedInventory] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/trader/users", { credentials: "include" })
      .then((res) => res.json())
      .then(async (usersData) => {
        setUsers(usersData);

        const profiles = {};

        for (const user of usersData) {
          if (!user.steamId) continue;

          try {
            const res = await fetch(
              `http://localhost:8080/api/steam/player?steamId=${user.steamId}`,
              { credentials: "include" },
            );

            const data = await res.json();
            const player = data?.response?.players?.[0];

            if (player) {
              profiles[user.id] = {
                avatar: player.avatarfull,
                nickname: player.personaname,
              };
            }
          } catch (err) {
            console.error(err);
          }
        }

        setSteamProfiles(profiles);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const loadInventory = async (userId, username) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/trader/inventory/${userId}`,
        { credentials: "include" },
      );

      const data = await res.json();

      setSelectedInventory(data);
      setSelectedUser(username);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-8 py-10" style={{ background: THEME.bg }}>
      <h1
        className="text-4xl font-black uppercase tracking-[4px] mb-10"
        style={{ color: THEME.text }}
      >
        Trader
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        {/* USERS */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: THEME.card,
            border: `1px solid ${THEME.border}`,
          }}
        >
          <h2
            className="text-lg font-bold uppercase tracking-[3px] mb-5"
            style={{ color: THEME.text }}
          >
            Uzytkownicy
          </h2>

          {loading ? (
            <p style={{ color: THEME.muted }}>Ladowanie...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${THEME.border}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={
                        steamProfiles[user.id]?.avatar ||
                        "https://avatars.cloudflare.steamstatic.com/0000000000000000000000000000000000000000_full.jpg"
                      }
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />

                    <div>
                      <p className="font-bold" style={{ color: THEME.text }}>
                        {steamProfiles[user.id]?.nickname || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      loadInventory(
                        user.id,
                        steamProfiles[user.id]?.nickname || "Unknown",
                      )
                    }
                    className="w-full py-2 rounded-lg text-sm font-bold uppercase tracking-[2px] transition-all"
                    style={{
                      background: "rgba(56,189,248,0.12)",
                      border: `1px solid ${THEME.border}`,
                      color: THEME.accent,
                    }}
                  >
                    Zobacz ekwipunek
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INVENTORY */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: THEME.card,
            border: `1px solid ${THEME.border}`,
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-lg font-bold uppercase tracking-[3px]"
              style={{ color: THEME.text }}
            >
              {selectedUser
                ? `Ekwipunek ${selectedUser}`
                : "Wybierz uzytkownika"}
            </h2>

            {selectedInventory.length > 0 && (
              <span className="text-sm" style={{ color: THEME.muted }}>
                Itemow: {selectedInventory.length}
              </span>
            )}
          </div>

          {selectedInventory.length === 0 ? (
            <div
              className="h-[400px] flex items-center justify-center rounded-xl"
              style={{ border: `1px dashed ${THEME.border}` }}
            >
              <p style={{ color: THEME.muted }}>Brak ekwipunku</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedInventory.map((item) => {
                const skin = item.skin;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${THEME.border}`,
                    }}
                  >
                    <img
                      src={"http://localhost:8080" + skin.imageUrl}
                      alt={skin.name}
                      className="w-full h-32 object-contain"
                    />

                    <p
                      className="font-bold text-sm mt-3"
                      style={{ color: THEME.text }}
                    >
                      {skin.name}
                    </p>

                    <p className="text-xs mt-1" style={{ color: THEME.muted }}>
                      {skin.weapon}
                    </p>

                    <p
                      className="text-sm font-bold mt-2"
                      style={{ color: THEME.accent }}
                    >
                      {skin.price} zł
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trader;
