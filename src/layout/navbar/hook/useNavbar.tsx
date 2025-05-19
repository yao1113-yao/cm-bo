import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { MenuProps, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { Api } from "../../../context/ApiContext";
import { CircleFlag } from "react-circle-flags";
import { userApi } from "../../../service/CallApi";

export const useNavbar = () => {
  const { t, i18n } = useTranslation();
  const { userInfo, setUserInfo } = useContext(Api);
  const navigate = useNavigate();

  const userInfoItems: MenuProps["items"] = [
    {
      key: "/user/info/profile",
      label: t("profile"),
      icon: <UserOutlined />,
      onClick: () => navigate("/user/info/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: t("logOut"),
      danger: true,
      icon: <LogoutOutlined />,
      onClick: () => handleLogout(),
    },
  ];

  const languageMenu: MenuProps["items"] = [
    {
      label: t("english"),
      key: "EN",
      icon: <CircleFlag countryCode="us" height="20" />,
      onClick: (key) => handleUpdateLanguage(key.key),
    },
    {
      label: t("mandarin"),
      key: "CN",
      icon: <CircleFlag countryCode="cn" height="20" />,
      onClick: (key) => handleUpdateLanguage(key.key),
    },
    {
      label: t("bahasa"),
      key: "MY",
      icon: <CircleFlag countryCode="my" height="20" />,
      onClick: (key) => handleUpdateLanguage(key.key),
    },
  ];

  async function handleLogout() {
    localStorage.removeItem("userID");
    localStorage.removeItem("userToken");
    setUserInfo(undefined);
    navigate("/");
  }

  async function handleUpdateLanguage(lang: string) {
    const object = {
      UserID: localStorage.getItem("userID"),
      UserToken: localStorage.getItem("userToken"),
      Lang: lang,
    };

    await userApi("/update-language", object)
      .then(() => i18n.changeLanguage(lang))
      .catch((error) =>
        message.error({
          content: error?.response?.data?.message,
          key: error?.response?.data?.message,
        })
      );
  }

  return { t, i18n, navigate, userInfo, userInfoItems, languageMenu };
};
