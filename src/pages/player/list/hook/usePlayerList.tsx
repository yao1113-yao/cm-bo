import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Dropdown, MenuProps, message, Space, TableProps, Tooltip } from "antd";
import { StopOutlined, DownOutlined, EditOutlined, DollarOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { formatDateTime, formatIndex, formatNumber, formatStatus, formatString } from "../../../../function/CommonFunction";
import { playerApi } from "../../../../service/CallApi";
import { IPaginationType, IPlayerType } from "../../../../type/main.interface";

interface IGetPlayerListReq {
  playerID: string;
  agentID: string;
  status: number;
  page: number;
  pageSize: number;
}

export const usePlayerList = () => {
  const { t } = useTranslation();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openEditPlayer, setOpenEditPlayer] = useState<boolean>(false);
  const [editPlayerRecord, setEditPlayerRecord] = useState<IPlayerType | undefined>();
  const [openUpdateBalancePlayer, setOpenUpdateBalancePlayer] = useState<boolean>(false);
  const [updateBalanceRecord, setUpdateBalanceRecord] = useState<IPlayerType | undefined>();
  const [apiData, setApiData] = useState<IPlayerType[] | undefined>();
  const [userInput, setUserInput] = useState<IGetPlayerListReq | undefined>();
  const [apiDataPagination, setApiDataPagination] = useState<IPaginationType>({ currentPage: 1, perPage: 10, total: 0, totalPage: 0 });
  const initialValues = location?.state?.userInput !== undefined ? { loginID: location?.state?.userInput?.loginID, status: location?.state.userInput.status, page: location?.state.userInput.page, pageSize: location?.state.userInput.pageSize } : { loginID: "", status: 9, page: 1, pageSize: 10 };

  useEffect(() => {
    handleGetPlayerList(initialValues, initialValues.page, initialValues.pageSize);
  }, []);

  const columns: TableProps<IPlayerType>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },
    {
      title: t("game"),
      dataIndex: "game",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("loginID"),
      dataIndex: "loginID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("password"),
      dataIndex: "password",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("status"),
      dataIndex: "status",
      ellipsis: true,
      render: (text: number) => {
        return formatStatus(text, t);
      },
    },
    {
      title: t("credit"),
      dataIndex: "balance",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("accountType"),
      dataIndex: "accountType",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("name"),
      dataIndex: "name",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },

    {
      title: t("phone"),
      dataIndex: "phone",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("remark"),
      dataIndex: "remark",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("lastUpdate"),
      dataIndex: "updateDate",
      ellipsis: true,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("createDate"),
      dataIndex: "createDate",
      ellipsis: true,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("action"),
      ellipsis: true,
      render: (record: any) => {
        return (
          <Space>
            <Dropdown menu={{ items: statusItems }}>
              <Button>
                <StopOutlined />
                <DownOutlined />
              </Button>
            </Dropdown>

            <Tooltip title={t("checkBalancePlayer")}>
              <Button icon={<SyncOutlined />} />
            </Tooltip>

            <Tooltip title={t("updateBalancePlayer")}>
              <Button icon={<DollarOutlined />} onClick={() => handleOpenModalUpdateBalancePlayer(record)} />
            </Tooltip>
            <Tooltip title={t("editPlayer")}>
              <Button icon={<EditOutlined />} onClick={() => handleOpenModalEditPlayer(record)} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const statusItems: MenuProps["items"] = [
    {
      key: "title",
      type: "group",
      label: t("status"),
      children: [
        {
          key: "active",
          label: t("active"),
        },
        {
          key: "inActive",
          label: t("inActive"),
          danger: true,
        },
      ],
    },
  ];

  function handleOpenModalEditPlayer(record: IPlayerType) {
    setOpenEditPlayer(true);
    setEditPlayerRecord(record);
  }

  function handleOpenModalUpdateBalancePlayer(record: IPlayerType) {
    setOpenUpdateBalancePlayer(true);
    setUpdateBalanceRecord(record);
  }

  async function handleGetPlayerList(values: any, page: number = 1, pageSize: number = 10) {
    setIsLoading(true);
    const input = {
      ...values,
      page: page,
      pageSize: pageSize,
    };
    setUserInput(input);
    const object = {
      UserID: userID,
      UserToken: userToken,
      loginID: values?.loginID,
      Status: values?.status,
      page: page,
      pageSize: pageSize,
    };
    await playerApi("/player-list", object)
      .then((result) => {
        setApiData(result.data);
        setApiDataPagination(result.data3);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
  }

  return { t, isLoading, openEditPlayer, setOpenEditPlayer, editPlayerRecord, openUpdateBalancePlayer, setOpenUpdateBalancePlayer, updateBalanceRecord, apiData, setApiData, userInput, apiDataPagination, setApiDataPagination, initialValues, columns, handleGetPlayerList };
};
