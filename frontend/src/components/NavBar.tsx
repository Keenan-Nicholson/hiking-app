import { useQuery } from "@tanstack/react-query";

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

  return (
    <div className="bg-white text-black text-center m-0 p-0 shadow-inner dark:shadow-black/40">
      <h1 className="m-0 p-5">Hiking Mode</h1>
      <p>{username ?? "Not logged in"}</p>
    </div>
  );
};
