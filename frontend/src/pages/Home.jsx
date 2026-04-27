import Navbar from "../components/Navbar";
import Cases from "../components/Cases.jsx";
export default function Home() {
  return (
    <div className={"bg-[#15171C] min-h-screen"}>
      <Navbar />
      <main className="pt-24 min-h-screen text-white">
        <Cases />
      </main>
    </div>
  );
}
