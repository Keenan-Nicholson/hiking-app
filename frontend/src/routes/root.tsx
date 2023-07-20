import { NavBar } from "../components/NavBar";
import "../components/root.css";
import { Map } from "../components/Map";

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
