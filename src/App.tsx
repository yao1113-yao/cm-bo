import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login/Login";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import PlayerList from "./pages/player/list/PlayerList";
import PlayerRegister from "./pages/player/register/PlayerRegister";
import { useContext } from "react";
import { Api } from "./context/ApiContext";
import { ConfigProvider } from "antd";
import Maybank from "./pages/bank/maybank/Maybank";
import CimbBank from "./pages/bank/cimbbank/CimbBank";
import RHBBank from "./pages/bank/rhbbank/RHBBank";

interface IProtectedType {
  roles: Array<number>;
  component: React.ReactNode;
}

function App() {
  const { userInfo } = useContext(Api);

  const Protected = ({ roles, component }: IProtectedType) => {
    if (roles?.some((e) => e === userInfo?.userType)) {
      return component;
    }
    // return <Navigate to="/not-found" replace />;
  };

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    {
      element: <MainLayout />,
      children: [
        { path: "/dashboard/:PageType", element: <Protected roles={[1, 2, 3]} component={<Dashboard />} /> },
        { path: "/player/list", element: <Protected roles={[1, 2]} component={<PlayerList />} /> },
        { path: "/player/register", element: <Protected roles={[1, 2]} component={<PlayerRegister />} /> },
        { path: "/bank/maybank", element: <Protected roles={[1, 2]} component={<Maybank />} /> },
        { path: "/bank/cimb", element: <Protected roles={[1, 2]} component={<CimbBank />} /> },
        { path: "/bank/rhb", element: <Protected roles={[1, 2]} component={<RHBBank />} /> },
      ],
    },
  ]);
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#5b8c00" } }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
