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
import KioskBalance from "./pages/bank/kiosk-balance/KioskBalance";
import KioskErrorReport from "./pages/bank/error-report/kiosk/KioskErrorReport";
import BankErrorReport from "./pages/bank/error-report/bank/BankErrorReport";
import MatchBankLater from "./pages/bank/match-bank-later/MatchBankLater";
import DailyReport from "./pages/report/daily/DailyReport";
import TeamCase from "./pages/report/case-sales/TeamCase";
import TeamKioskBalance from "./pages/report/kiosk-balance/TeamKioskBalance";
import TeamSalesReport from "./pages/report/sales/team/TeamSalesReport";
import StaffSalesReport from "./pages/report/sales/staff/StaffSalesReport";
import TeamBankBalance from "./pages/report/bank-balance/TeamBankBalance";
import KioskLog from "./pages/bank/kiosk-log/KioskLog";
import ErrorReport from "./pages/bank/error-report/error/ErrorReport";
import Error from "./pages/report/error/Error";
import UserList from "./pages/setting/user/list/List";
import CompanyList from "./pages/setting/company/list/List";
import BankRecordHaventAssign from "./pages/bank/bank-record-havent-assign/BankRecordHaventAssign";
import DeviceCase from "./pages/report/device-case/DeviceCase";

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
        { path: "/dashboard/:PageType", element: <Protected roles={[2, 3]} component={<Dashboard />} /> },
        { path: "/player/list", element: <Protected roles={[1, 2]} component={<PlayerList />} /> },
        { path: "/player/register", element: <Protected roles={[1, 2, 3]} component={<PlayerRegister />} /> },
        { path: "/bank-transaction", element: <Protected roles={[2]} component={<Bank />} /> },
        { path: "/bank-transaction/havent-assign", element: <Protected roles={[2, 4, 5]} component={<BankRecordHaventAssign />} /> },
        { path: "/match-bank-later", element: <Protected roles={[1, 2]} component={<MatchBankLater />} /> },
        { path: "/company-bank", element: <Protected roles={[2]} component={<BankBalance />} /> },
        { path: "/kiosk-balance", element: <Protected roles={[2]} component={<KioskBalance />} /> },
        { path: "/kiosk-log", element: <Protected roles={[1, 2]} component={<KioskLog />} /> },
        { path: "/bank-marketing", element: <Protected roles={[2, 4, 5]} component={<BankRecord />} /> },
        { path: "/rekemen-record", element: <Protected roles={[1, 2, 4, 5]} component={<RekemenRecord />} /> },
        { path: "/transfer-record", element: <Protected roles={[1, 2, 4, 5]} component={<TransferRecord />} /> },
        { path: "/kiosk-adjustment", element: <Protected roles={[1, 2, 4, 5]} component={<KioskErrorReport />} /> },
        { path: "/bank-adjustment", element: <Protected roles={[1, 2, 4, 5]} component={<BankErrorReport />} /> },
        { path: "/report/daily", element: <Protected roles={[1, 4, 5]} component={<DailyReport />} /> },
        { path: "/team/case", element: <Protected roles={[1, 4, 5]} component={<TeamCase />} /> },
        { path: "/device/case", element: <Protected roles={[1, 4, 5]} component={<DeviceCase />} /> },
        { path: "/team/kiosk-balance", element: <Protected roles={[1, 4, 5]} component={<TeamKioskBalance />} /> },
        { path: "/team/bank-balance", element: <Protected roles={[1, 4, 5]} component={<TeamBankBalance />} /> },
        { path: "/error-report", element: <Protected roles={[1, 2, 4, 5]} component={<ErrorReport />} /> },
        { path: "/team/sales", element: <Protected roles={[1, 4, 5]} component={<TeamSalesReport />} /> },
        { path: "/staff/sales", element: <Protected roles={[1, 4, 5]} component={<StaffSalesReport />} /> },
        { path: "/staff/error", element: <Protected roles={[1, 4, 5]} component={<Error />} /> },
        { path: "/user/list", element: <Protected roles={[1, 4, 5]} component={<UserList />} /> },
        { path: "/company/list", element: <Protected roles={[1, 4, 5]} component={<CompanyList />} /> },
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
