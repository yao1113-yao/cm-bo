import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Form, message, TableProps } from "antd";
import { IDeviceType, ILogType, IUserType } from "../../../../../type/main.interface";
import { getAllItemCodeList, getAllStaffList } from "../../../../../function/ApiFunction";
import { formatDateTime, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { LogApi } from "../../../../../service/CallApi";
import { Api } from "../../../../../context/ApiContext";

export const useBankErrorReport = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKioskReportLoading, setKioskReportIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ILogType[] | undefined>();
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();
  const [allStaffList, setAllStaffList] = useState<[IUserType] | undefined>();

  const initialValues = {
    staffSrno: 0,
    bank: "all",
    remark: "",
  };

  useEffect(() => {
    getAllItemCodeList("MBank", setIsLoading, setAllBankList);
    getAllStaffList(setIsLoading, subdomain, setAllStaffList);
    handleGetBankErrorReport(initialValues);
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
      title: t("staffID"),
      dataIndex: "staffID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankCode"),
      dataIndex: "bankCode",
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

  async function handleInsertBankError(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: subdomain,
      type: values?.type,
      staffSrno: values?.staffSrno,
      bankCode: values?.bank,
      point: values?.point,
      remark: values?.remark,
    };
    await LogApi("/insert-bank-error-report", object)
      .then(() => {
        form.resetFields();
        messageApi.open({
          type: "success",
          content: "Insert Success",
        });
        handleGetBankErrorReport(initialValues);
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setIsLoading(false);
  }

  async function handleGetBankErrorReport(values: any) {
    setKioskReportIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: subdomain,
      staffSrno: values?.staffSrno,
      bankCode: values?.bank,
      remark: values?.remark,
      type: "all",
    };
    await LogApi("/bank-error-report", object)
      .then((result) => {
        setApiData(result.data);
        setKioskReportIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setKioskReportIsLoading(false);
  }

  return { t, contextHolder, isLoading, isKioskReportLoading, form, allBankList, allStaffList, apiData, initialValues, columns, handleInsertBankError, handleGetBankErrorReport };
};
