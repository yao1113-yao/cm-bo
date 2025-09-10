import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Form, message, TableProps } from "antd";
import { IGameProviderType, ILogType, IUserType } from "../../../../../type/main.interface";
import { getAllGameProviderList, getAllStaffList } from "../../../../../function/ApiFunction";
import { formatDateTime, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { LogApi } from "../../../../../service/CallApi";
import { Api } from "../../../../../context/ApiContext";
import dayjs from "dayjs";

export const useKioskErrorReport = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKioskReportLoading, setKioskReportIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ILogType[] | undefined>();
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();
  const [allStaffList, setAllStaffList] = useState<[IUserType] | undefined>();

  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    staffSrno: 0,
    gameName: "all",
    remark: "",
  };
  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
    getAllStaffList(setIsLoading, subdomain, setAllStaffList);
    handleGetKioskErrorReport(initialValues);
  }, []);

  const columns: TableProps<ILogType>["columns"] = [
    {
      title: "createDate",
      dataIndex: "createDate",
      hidden: false,
      render: (text: any) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("type"),
      dataIndex: "type",
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
      companyID: subdomain,
      ...values,
    };
    await LogApi("/insert-kiosk-adjustment", object)
      .then(() => {
        form.resetFields();
        messageApi.open({
          type: "success",
          content: "success",
        });
        form.setFieldValue("searchDate", [dayjs().subtract(6, "hour"), dayjs()]);
        handleGetKioskErrorReport({ searchDate: [dayjs().subtract(6, "hour"), dayjs()], staffSrno: 0, gameName: "all", remark: "" });
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
      companyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      gameName: values?.gameName,
      remark: values?.remark,
    };
    await LogApi("/kiosk-adjustment-list", object)
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
