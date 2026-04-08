import { useEffect, useState } from "react";

function getCsrfToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN"))
    ?.split("=")[1];
}

function Home() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithSteam = () => {
    window.location.href = "http://localhost:8080/auth/steam/login";
  };

  const logout = async () => {
    const csrfToken = getCsrfToken();

    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-XSRF-TOKEN": csrfToken,
      },
    });

    setProfile(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const meRes = await fetch("http://localhost:8080/auth/me", {
          credentials: "include",
        });

        if (!meRes.ok) {
          setProfile(null);
          return;
        }

        const user = await meRes.json();
        const steamId = user?.steamId;

        if (!steamId) {
          setProfile(null);
          return;
        }

        const steamRes = await fetch(
          `http://localhost:8080/api/steam/player?steamId=${steamId}`,
          {
            credentials: "include",
          },
        );

        const data = await steamRes.json();
        const player = data?.response?.players?.[0];

        if (player) {
          setProfile({
            avatar: player.avatarfull,
            nickname: player.personaname,
          });
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Glimzy</h1>

      {loading ? (
        <p>Ładowanie...</p>
      ) : !profile ? (
        <button
          onClick={loginWithSteam}
          style={{ padding: "10px 20px", fontSize: 16 }}
        >
          Login with Steam
        </button>
      ) : (
        <div>
          <img
            src={profile.avatar}
            alt="avatar"
            style={{
              borderRadius: "50%",
              marginBottom: 10,
              width: 100,
              height: 100,
            }}
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
      )}
    </div>
  );
}

export default Home;
