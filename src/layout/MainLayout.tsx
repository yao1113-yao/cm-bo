import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

const MainLayout = () => {
  const [collapse, setCollapse] = useState<boolean>(false);

  return (
    <Layout>
      <Sidebar collapse={collapse} setCollapse={setCollapse} />

      <Layout style={{ minHeight: "100vh" }}>
        <Navbar collapse={collapse} setCollapse={setCollapse} />

        <Layout.Content style={{ padding: 15 }}>
          <Outlet />
        </Layout.Content>

        <Layout.Footer style={{ textAlign: "center", fontSize: 10 }}>COPYRIGHT © Cashier Marketing 2025. ALL RIGHTS RESERVED</Layout.Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
