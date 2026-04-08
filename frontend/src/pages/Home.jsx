import { useEffect, useState, useCallback } from "react";

function Home() {
  const [token, setToken] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("token") || localStorage.getItem("token");
  });

  const [steamId, setSteamId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("steamId") || localStorage.getItem("steamId");
  });

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const steamIdFromUrl = urlParams.get("steamId");

    if (tokenFromUrl && steamIdFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      localStorage.setItem("steamId", steamIdFromUrl);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("steamId");
    setToken(null);
    setSteamId(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !steamId) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/steam/player?steamId=${steamId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();

        if (data?.response?.players?.length > 0) {
          const player = data.response.players[0];
          setProfile({
            avatar: player.avatarfull,
            nickname: player.personaname,
          });
        }
      } catch (err) {
        console.error(err);
        logout();
      }
    };

    fetchProfile();
  }, [token, steamId, logout]);

  const loginWithSteam = () => {
    window.location.href = "http://localhost:8080/auth/steam/login";
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Glimzy</h1>

      {!token ? (
        <button
          onClick={loginWithSteam}
          style={{ padding: "10px 20px", fontSize: 16 }}
        >
          Login with Steam
        </button>
      ) : profile ? (
        <div>
          <img
            src={profile.avatar}
            alt="avatar"
            style={{ borderRadius: "50%", marginBottom: 10 }}
          />
          <p style={{ fontSize: 18, fontWeight: "bold" }}>{profile.nickname}</p>
          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              fontSize: 16,
              marginTop: 10,
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Ładowanie profilu...</p>
      )}
    </div>
  );
}
export default Home;
