import { NavBar } from "../components/NavBar.tsx";
import "../components/root.css";
import { Map } from "../components/Map.tsx";

export default function Root() {
  return (
    <div>
      <div className="Map">
        <NavBar />
        <Map />
      </div>
    </div>
  );
}
