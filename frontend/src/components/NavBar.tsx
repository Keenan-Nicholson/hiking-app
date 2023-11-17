import { useQuery } from "@tanstack/react-query";
import { DropZone } from "./DropZone";
import { useState } from "react";

export const NavBar = () => {
  const { data } = useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      const resp = await fetch("http://127.0.0.1:8080/whoami", {
        credentials: "include",
      });
      return resp.json();
    },
  });
  const username = data?.username;

  const [dropZoneVisible, setDropZoneVisible] = useState(false);

  const handleButtonClick = () => {
    setDropZoneVisible(!dropZoneVisible);
  };

  return (
    <nav className="bg-white dark:bg-gray-900  w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            onClick={handleButtonClick}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {username && "Upload GPX"}
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="/"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                {username ?? "Not logged in"}
              </a>
            </li>
          </ul>
        </div>
        {dropZoneVisible && username && (
          <div className="popup-overlay">
            <div className="popup-content">
              <button onClick={handleButtonClick}>x</button>
              <DropZone />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
