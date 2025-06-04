import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login/Login";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import PlayerList from "./pages/player/list/PlayerList";
import PlayerRegister from "./pages/player/register/PlayerRegister";
import { useContext } from "react";
import { Api } from "./context/ApiContext";
import { ConfigProvider } from "antd";
import Bank from "./pages/bank/maybank/Maybank";
import BankBalance from "./pages/bank/bank-balance/BankBalance";
import BankRecord from "./pages/bank/bank-record/BankRecord";
import RekemenRecord from "./pages/bank/rekemen-record/RekemenRecord";
import TransferRecord from "./pages/bank/transfer-record/TransferRecord";

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
        { path: "/bank-transaction", element: <Protected roles={[1, 2]} component={<Bank />} /> },
        { path: "/company-bank", element: <Protected roles={[1, 2]} component={<BankBalance />} /> },
        { path: "/bank-marketing", element: <Protected roles={[1, 2]} component={<BankRecord />} /> },
        { path: "/rekemen-record", element: <Protected roles={[1, 2]} component={<RekemenRecord />} /> },
        { path: "/transfer-record", element: <Protected roles={[1, 2]} component={<TransferRecord />} /> },
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
