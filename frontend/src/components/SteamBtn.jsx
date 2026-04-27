import { useEffect, useState } from "react";

function SteamBtn() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithSteam = () => {
    window.location.href = "http://localhost:8080/auth/steam/login";
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setProfile(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const meRes = await fetch("http://localhost:8080/auth/me", {
        credentials: "include",
      });

      if (meRes.status === 401) {
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!meRes.ok) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const user = await meRes.json();

      const steamId = user?.steamId;

      if (!steamId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const steamRes = await fetch(
        `http://localhost:8080/api/steam/player?steamId=${steamId}`,
        { credentials: "include" },
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
      console.error("Profile fetch error:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <span className="text-gray-400 text-sm">Loading...</span>;
  }

  return !profile ? (
    <button
      onClick={loginWithSteam}
      className="flex items-center gap-2 bg-[#1b2838] text-white hover:bg-[#2a475e] active:bg-[#16202d] font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 ease-out shadow-md hover:shadow-lg border border-white/5 hover:border-white/10"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"
        alt="Steam"
        className="w-5 h-5"
      />

      <span>Login with Steam</span>
    </button>
  ) : (
    <div className="flex items-center gap-3">
      <img src={profile.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
      <span className="text-white text-sm font-medium">{profile.nickname}</span>

      <button
        onClick={logout}
        className="
          text-gray-400
          hover:text-red-500
          text-sm
          transition-colors duration-200
        "
      >
        Logout
      </button>
    </div>
  );
}

export default SteamBtn;
