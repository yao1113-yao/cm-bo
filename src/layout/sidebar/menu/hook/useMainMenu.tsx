import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { MenuProps } from "antd";
import { useTranslation } from "react-i18next";

import { DashboardOutlined, FileSearchOutlined } from "@ant-design/icons";
import { Api } from "../../../../context/ApiContext";

export const useMainMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userInfo } = useContext(Api);

  const currentPath = window.location.pathname.split("?")[0];
  const pathArr = currentPath.split("/");

  // const item = useMemo(() => {
  //   if (userInfo) {
  //     return [
  //       {
  //         label: t("dashboard"),
  //         key: "/dashboard",
  //         hidden: false,
  //         icon: <DashboardOutlined />,
  //       },
  //     ];
  //   }
  //   return [];
  // }, [userInfo]);

  const items = [
    {
      label: t("dashboard"),
      key: "/dashboard/deposit",
      hidden: userInfo && (userInfo.userType > 2 || userInfo?.userType === 1),
      icon: <DashboardOutlined />,
    },

    {
      label: t("Team Report"),
      key: "",
      type: "group",
      hidden: userInfo && userInfo.userType < 4 && userInfo?.userType !== 1,
      children: [
        {
          label: t("Team Case and Sales"),
          key: "/team/case",
          hidden: userInfo && userInfo.userType < 4 && userInfo?.userType !== 1,
          icon: <DashboardOutlined />,
        },
        {
          label: t("Team Kiosk Balance"),
          key: "/team/kiosk-balance",
          hidden: userInfo && userInfo.userType < 4 && userInfo?.userType !== 1,
          icon: <DashboardOutlined />,
        },
        {
          label: t("Team Bank Balance"),
          key: "/team/bank-balance",
          hidden: userInfo && userInfo.userType < 4 && userInfo?.userType !== 1,
          icon: <DashboardOutlined />,
        },
        {
          label: t("Team Sales Report"),
          key: "/team/sales",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType < 4 && userInfo?.userType !== 1,
        },
        {
          label: t("Staff Sales Report"),
          key: "/staff/sales",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType < 4 && userInfo?.userType !== 1,
        },
        {
          label: t("Error Report"),
          key: "/staff/error",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType < 3 && userInfo?.userType !== 1,
        },
      ],
    },
    {
      label: t("account"),
      key: "account",
      type: "group",
      hidden: userInfo && userInfo.userType > 2,
      children: [
        { label: t("registerPlayer"), key: "/player/register", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType > 2 },
        { label: t("playerList"), key: "/player/list", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType > 2 },
      ],
    },

    {
      label: t("bank"),
      key: "bank",
      type: "group",
      hidden: userInfo && userInfo.userType === 3,
      children: [
        {
          label: t("Bank Transaction"),
          key: "/bank-transaction",
          icon: <FileSearchOutlined />,
          hidden: userInfo && (userInfo.userType > 2 || userInfo?.userType === 1),
        },
        {
          label: t("Bank Balance"),
          key: "/company-bank",
          icon: <FileSearchOutlined />,
          hidden: userInfo && (userInfo.userType > 2 || userInfo?.userType === 1),
        },
        {
          label: t("Kiosk Balance"),
          key: "/kiosk-balance",
          icon: <FileSearchOutlined />,
          hidden: userInfo && (userInfo.userType > 2 || userInfo?.userType === 1),
        },
        {
          label: t("Kiosk Log"),
          key: "/kiosk-log",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType > 2,
        },
        {
          label: t("Match Bank Later Record"),
          key: "/match-bank-later",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType > 2,
        },
        {
          label: t("Deposit Withdraw Record"),
          key: "/bank-marketing",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType === 3,
        },
        {
          label: t("Rekemen Record"),
          key: "/rekemen-record",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType === 3,
        },
        {
          label: t("Transfer Record"),
          key: "/transfer-record",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType === 3,
        },
      ],
    },
    {
      label: t("errorReport"),
      key: "errorReport",
      type: "group",
      hidden: userInfo && userInfo.userType === 3,
      children: [
        {
          label: t("Bank Adjustment Report"),
          key: "/bank-adjustment",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType === 3,
        },
        {
          label: t("Kiosk Adjustment Report"),
          key: "/kiosk-adjustment",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType === 3,
        },
        {
          label: t("Error Report"),
          key: "/error-report",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType === 3,
        },
      ],
    },
    {
      label: t("setting"),
      key: "setting",
      type: "group",
      hidden: userInfo && userInfo.userType !== 1,
      children: [
        {
          label: t("user"),
          key: "/user",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType !== 1,
          children: [
            { label: t("registerUser"), key: "/user/register", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType !== 1 },
            { label: t("userList"), key: "/user/list", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType !== 1 },
          ],
        },
        {
          label: t("company"),
          key: "/company",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType !== 1,
          children: [
            { label: t("addCompany"), key: "/company/add", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType !== 1 },
            { label: t("companyList"), key: "/company/list", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType !== 1 },
          ],
        },
        {
          label: t("bank"),
          key: "/bank",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType !== 1,
          children: [
            { label: t("blackListBank"), key: "/bank/blacklist", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType !== 1 },
            { label: t("addBank"), key: "/bank/add", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType !== 1 },
            { label: t("bankList"), key: "/bank/list", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType !== 1 },
          ],
        },
        {
          label: t("gameProvider"),
          key: "/gp",
          icon: <FileSearchOutlined />,
          hidden: userInfo && userInfo.userType !== 1,
          children: [
            { label: t("addGP"), key: "/gp/add", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType !== 1 },
            { label: t("gpList"), key: "/gp/list", icon: <FileSearchOutlined />, hidden: userInfo && userInfo.userType !== 1 },
          ],
        },
      ],
    },
  ];

  function filterVisibleItems(items: any) {
    return items
      .filter((item: any) => !item.hidden)
      .map((item: any) => {
        if (item.children) {
          const visibleChildren = filterVisibleItems(item.children);
          return { ...item, children: visibleChildren };
        }
        return item;
      });
  }

  const menuItems: MenuProps["items"] = filterVisibleItems(items) as MenuProps["items"];

  function handleNavigate(values: any) {
    navigate(values?.key);
  }

  return { t, currentPath, pathArr, menuItems, handleNavigate };
};
