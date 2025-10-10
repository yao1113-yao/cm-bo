import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ICompanyType } from "../../../../../type/main.interface";
import { settingApi } from "../../../../../service/CallApi";
import { Button, Dropdown, MenuProps, message, Space, TableProps } from "antd";
import { formatDateTime, formatStatus, formatString } from "../../../../../function/CommonFunction";

import { StopOutlined, DownOutlined } from "@ant-design/icons";

interface IGetCompanyTypeReq {
  searchCompanyID: string;
  status: number;
}

export const useList = () => {
  const { t } = useTranslation();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const [messageApi, contextHolder] = message.useMessage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ICompanyType[] | undefined>([]);
  const [userInput, setUserInput] = useState<IGetCompanyTypeReq | undefined>(undefined);

  const initialValues = { searchUserID: "", status: 9 };

  useEffect(() => {
    handleGetUserList(initialValues);
  }, []);

  async function handleGetUserList(values: any) {
    setIsLoading(true);
    const input = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      ...values,
    };
    setUserInput(input);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      searchCompanyID: values?.searchCompanyID,
      Status: values?.status,
    };
    await settingApi("/company-list", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error?.response?.data?.message,
        });
      });
  }

  const columns: TableProps<ICompanyType>["columns"] = [
    {
      title: t("companyID"),
      dataIndex: "companyID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("googleSheetLink"),
      dataIndex: "googleSheetUrl",
      width: "40%",
      render: (text: string) => {
        return (
          <div style={{ fontWeight: "600", color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => window.open(text)}>
            {text !== "" ? formatString(text) : ""}
          </div>
        );
      },
    },
    {
      title: t("botIP"),
      dataIndex: "ip",
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
      title: t("createBy"),
      dataIndex: "createBy",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
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
            <Dropdown menu={{ items: statusItems(record) }}>
              <Button>
                <StopOutlined />
                <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const statusItems = (record: any): MenuProps["items"] => [
    {
      key: "title",
      type: "group",
      label: t("status"),
      children: [
        {
          key: "active",
          label: t("active"),
          disabled: record?.status === 1,
          onClick: () => {
            handleUpdateStatus(record, 1);
          },
        },
        {
          key: "inActive",
          label: t("inActive"),
          disabled: record?.status === 0,
          danger: true,
          onClick: () => {
            handleUpdateStatus(record, 0);
          },
        },
      ],
    },
  ];

  async function handleUpdateStatus(values: any, status: number) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      UpdateUserSrno: values?.srno,
      status: status,
    };
    await settingApi("/update-company-status", object)
      .then((result) => {
        messageApi.open({
          type: "success",
          content: result.message,
        });
        handleGetUserList(userInput);
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error?.response?.data?.message,
        });
      });
    setIsLoading(false);
  }

  return { t, contextHolder, isLoading, userInput, apiData, initialValues, columns, handleGetUserList };
};
