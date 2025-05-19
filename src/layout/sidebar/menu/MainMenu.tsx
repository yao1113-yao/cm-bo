import { Menu } from "antd";
import { useMainMenu } from "./hook/useMainMenu";

const MainMenu = () => {
  const { currentPath, pathArr, menuItems, handleNavigate } = useMainMenu();

  return <Menu items={menuItems} mode="inline" theme="dark" selectedKeys={[currentPath]} defaultOpenKeys={[pathArr[0], pathArr[1]]} onClick={handleNavigate} />;
};

export default MainMenu;
