import { Dispatch, SetStateAction, useContext } from "react";
import { Api } from "../../context/ApiContext";

import { Drawer, DrawerProps, Layout } from "antd";
import MainMenu from "./menu/MainMenu";

interface SidebarProps {
  collapse: boolean;
  setCollapse: Dispatch<SetStateAction<boolean>>;
}

interface IDrawerType {
  placement: DrawerProps["placement"];
  closable: boolean;
  onClose: any;
  open: boolean;
  width: number;
  bodyStyle: any;
}

const Sidebar = ({ collapse, setCollapse }: SidebarProps) => {
  const { windowWidth } = useContext(Api);

  const siderSetting = {
    trigger: null,
    collapsible: true,
    collapsedWidth: 0,
    collapsed: collapse,
    width: 280,
  };

  const drawerSetting: IDrawerType = {
    placement: "left",
    closable: false,
    onClose: () => setCollapse(true),
    open: !collapse,
    width: 280,
    bodyStyle: { padding: 0, background: "#001529" },
  };

  const SideMenu = () => {
    return (
      <Layout.Sider {...siderSetting} style={{ position: "sticky", top: 0, left: 0, height: "100vh", overflowY: "auto" }}>
        <div className="logo-img" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* <img src={Logo} alt="Logo" loading="lazy" style={{ width: "70%" }} /> */}
          <p style={{ fontSize: "1.2rem", color: "white" }}>Cashier Marketing</p>
        </div>
        <MainMenu />
      </Layout.Sider>
    );
  };

  const DrawerMenu = () => {
    return (
      <Drawer {...drawerSetting}>
        <div className="logo-img" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* <img src={Logo} alt="Logo" loading="lazy" style={{ width: "70%" }} /> */}
          <p style={{ fontSize: "1rem", color: "white" }}>Cashier Marketing</p>
        </div>
        <MainMenu />
      </Drawer>
    );
  };

  return windowWidth < 1200 ? DrawerMenu() : SideMenu();
};

export default Sidebar;
