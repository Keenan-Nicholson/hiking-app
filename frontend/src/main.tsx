import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import Login from "./routes/login";
import CreateAccountPage from "./routes/create-account";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Map } from "./components/Map";
import { PrivateRoute } from "./components/PrivateRoute";

const router = createBrowserRouter(
  [
    {
      element: <Root />,
      children: [
        {
          path: "/",
          element: <PrivateRoute />,
          children: [
            {
              index: true,
              element: <Map />,
            },
          ],
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/create-account",
          element: <CreateAccountPage />,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
