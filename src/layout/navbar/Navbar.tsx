import { Dispatch, SetStateAction } from "react";

import "./navbar.scss";
import { Dropdown, Layout, Select } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, TranslationOutlined } from "@ant-design/icons";
import { FaUserCircle } from "react-icons/fa";

import { useNavbar } from "./hook/useNavbar";

interface NavbarProps {
  collapse: boolean;
  setCollapse: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ collapse, setCollapse }: NavbarProps) => {
  const { userInfo, userInfoItems, languageMenu } = useNavbar();

  return (
    <Layout.Header className="navbar">
      <div style={{ fontSize: 20, cursor: "pointer" }} onClick={() => setCollapse(!collapse)}>
        {collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      <div className="navbar-items">
        <Dropdown placement="bottom" menu={{ items: userInfoItems }}>
          <div className="item">
            <FaUserCircle style={{ fontSize: 20 }} />
            {userInfo?.userID}
          </div>
        </Dropdown>

        <Dropdown menu={{ items: languageMenu }}>
          <div className="item">
            <TranslationOutlined style={{ fontSize: 20 }} />
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
};

export default Navbar;
