import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Form, message, TableProps } from "antd";
import { IGameProviderType, ILogType, IUserType } from "../../../../../type/main.interface";
import { getAllGameProviderList, getAllStaffList } from "../../../../../function/ApiFunction";
import { formatIndex, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { LogApi } from "../../../../../service/CallApi";

export const useKioskErrorReport = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKioskReportLoading, setKioskReportIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ILogType[] | undefined>();
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();
  const [allStaffList, setAllStaffList] = useState<[IUserType] | undefined>();

  const initialValues = {
    staffSrno: 0,
    gameName: "all",
    remark: "",
  };
  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
    getAllStaffList(setIsLoading, "BEST1", setAllStaffList);
    handleGetKioskErrorReport(initialValues);
  }, []);

  const columns: TableProps<ILogType>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },
    {
      title: t("staffID"),
      dataIndex: "staffID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("gameName"),
      dataIndex: "gameName",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("beforeBalance"),
      dataIndex: "beforeBalance",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600", color: text < 0 ? "red" : "green" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("afterBalance"),
      dataIndex: "afterBalance",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
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
      title: t("createBy"),
      dataIndex: "createBy",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
  ];

  async function handleInsertKioskError(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: "BEST1",
      ...values,
    };
    await LogApi("/insert-error-report", object)
      .then(() => {
        form.resetFields();
        messageApi.open({
          type: "success",
          content: "Insert Success",
        });
        handleGetKioskErrorReport(initialValues);
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setIsLoading(false);
  }

  async function handleGetKioskErrorReport(values: any) {
    setKioskReportIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: "BEST1",
      staffSrno: values?.staffSrno,
      gameName: values?.gameName,
      remark: values?.remark,
    };
    await LogApi("/kiosk-error-report", object)
      .then((result) => {
        setApiData(result.data);
        setKioskReportIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setKioskReportIsLoading(false);
  }

  return { t, contextHolder, isLoading, isKioskReportLoading, form, allGameList, allStaffList, apiData, initialValues, columns, handleInsertKioskError, handleGetKioskErrorReport };
};
