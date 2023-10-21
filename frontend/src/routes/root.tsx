import { NavBar } from "../components/NavBar";
import { PrivateRoute } from "../components/PrivateRoute";
import "../components/root.css";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="Map">
      <NavBar />
      <PrivateRoute />
      <Outlet />
    </div>
  );
}
