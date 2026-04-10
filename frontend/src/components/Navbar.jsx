import SteamBtn from "../components/SteamBtn.jsx";

const Navbar = () => {
  return (
    <nav className="bg-[#16171D] flex rounded-b-2xl shadow-lg shadow-black/30 p-4 fixed w-full">
      <h1 className="text-4xl font-bold text-[#7ae932]">GLIMZY</h1>
      <div className={"ml-auto"}>
        <SteamBtn />
      </div>
    </nav>
  );
};

export default Navbar;
