import SteamBtn from "../components/SteamBtn.jsx";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const links = [
  { to: "/", label: "Skrzynki" },
  { to: "/battle", label: "Bitwy" },
  { to: "/trader", label: "Trader" },
  { to: "/freecases", label: "Darmowe skrzynki" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const refs = useRef([]);

  const [style, setStyle] = useState({
    left: 0,
    width: 0,
    active: false,
  });

  useEffect(() => {
    const index = links.findIndex((l) => {
      if (l.to === "/") return pathname === "/";
      return pathname.startsWith(l.to);
    });

    const el = refs.current[index];
    if (!el) return;

    const left = el.offsetLeft;
    const width = el.offsetWidth;

    setStyle({
      left,
      width,
      active: false,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStyle({
          left,
          width,
          active: true,
        });
      });
    });
  }, [pathname]);

  return (
    <nav className="bg-[#16171D] flex rounded-b-2xl shadow-lg shadow-black/30 p-4 fixed w-full border border-b-gray-700">
      <h1 className="text-4xl font-bold text-[#7ae932] select-none">GLIMZY</h1>

      <div className="relative flex ml-10 gap-2 items-center">
        <div
          className="absolute bottom-0 h-0.75 rounded-full
                     bg-linear-to-r from-green-400 to-emerald-600
                     origin-center
                     transition-transform duration-300 ease-out"
          style={{
            left: style.left,
            width: style.width,
            transform: style.active ? "scaleX(1)" : "scaleX(0)",
          }}
        />

        {links.map((link, i) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            ref={(el) => (refs.current[i] = el)}
            className={({ isActive }) =>
              `relative px-3 py-2 transition-all duration-300 select-none
               ${
                 isActive
                   ? "text-white text-lg font-semibold"
                   : "text-gray-400 hover:text-gray-300"
               }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="ml-auto">
        <SteamBtn />
      </div>
    </nav>
  );
};

export default Navbar;
