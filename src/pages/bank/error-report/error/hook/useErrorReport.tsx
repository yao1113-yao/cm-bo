import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Form, message, TableProps, Tooltip } from "antd";
import { IBankErrorType, IDeviceType, IGameProviderType, ILogType, IUserType } from "../../../../../type/main.interface";
import { getAllGameProviderList, getAllItemCodeList, getAllStaffList } from "../../../../../function/ApiFunction";
import { formatDateTime, formatNumber, formatString, searchDateRange } from "../../../../../function/CommonFunction";
import { LogApi } from "../../../../../service/CallApi";
import { Api } from "../../../../../context/ApiContext";
import dayjs from "dayjs";

import { BankOutlined, ExceptionOutlined } from "@ant-design/icons";

export const useErrorReport = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { subdomain, userInfo, companyList } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKioskReportLoading, setKioskReportIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ILogType[] | undefined>();
  const [apiData2, setApiData2] = useState<IBankErrorType[] | undefined>();
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();
  const [allStaffList, setAllStaffList] = useState<[IUserType] | undefined>();
  const [type, setType] = useState<string>("");
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();

  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<IBankErrorType | undefined>();
  const [openBankRecord, setOpenBankRecord] = useState<boolean>(false);
  const [openErrorMarketingRecord, setOpenErrorMarketingRecord] = useState<boolean>(false);
  const [selectedKioskError, setSelectedKioskDeposit] = useState<ILogType | undefined>();

  const initialValues = {
    searchDate: searchDateRange("day"),
    staffSrno: 0,
    type: "Bank Error",
    gameName: "all",
    bankCode: "all",
    searchCompanyID: "all",
    remark: "",
  };

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
    getAllItemCodeList("MBank", setIsLoading, setAllBankList);

    getAllStaffList(setIsLoading, subdomain, setAllStaffList);
    // handleGetErrorReport(initialValues);
  }, []);

  const columns: TableProps<ILogType>["columns"] = [
    {
      title: "action",
      align: "center",
      ellipsis: true,
      render: (record) => {
        return (
          record?.mktSrno === 0 && (
            <Tooltip title={t("assignMarketingRecord")}>
              <Button icon={<ExceptionOutlined />} onClick={() => OpenModalErrorMarketingRecord(record)}></Button>
            </Tooltip>
          )
        );
      },
    },
    {
      title: "createDate",
      dataIndex: "createDate",
      hidden: false,
      render: (text: any) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("companyID"),
      dataIndex: "companyID",
      ellipsis: true,
      hidden: userInfo?.userType === 2,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("Type"),
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
      title: t("gameName"),
      dataIndex: "gameName",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },

    {
      title: t("amount"),
      dataIndex: "amount",
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
    {
      title: "createDate",
      dataIndex: "createDate",
      hidden: false,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("updateBy"),
      dataIndex: "updateBy",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("updateDate"),
      dataIndex: "updateDate",
      ellipsis: true,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
  ];

  const bankColumns: TableProps<IBankErrorType>["columns"] = [
    {
      title: "action",
      align: "center",
      ellipsis: true,
      render: (record) => {
        return (
          record?.bankRecordSrno === 0 && (
            <Tooltip title={t("assignBank")}>
              <Button icon={<BankOutlined />} onClick={() => OpenModalBankRecord(record)} disabled={record?.isEditing === 1}></Button>
            </Tooltip>
          )
        );
      },
    },
    {
      title: t("companyID"),
      dataIndex: "companyID",
      ellipsis: true,
      hidden: userInfo?.userType === 2,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
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
      title: t("bankCode"),
      dataIndex: "bankCode",
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
      title: t("amount"),
      dataIndex: "amount",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600", color: text < 0 ? "red" : "green" }}>{formatNumber(text)}</div>;
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
    {
      title: "createDate",
      dataIndex: "createDate",
      hidden: false,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("updateBy"),
      dataIndex: "updateBy",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("updateDate"),
      dataIndex: "updateDate",
      ellipsis: true,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
  ];

  function OpenModalBankRecord(values: any) {
    setSelectedPendingDeposit(values);
    setOpenBankRecord(!openBankRecord);
  }

  function OpenModalErrorMarketingRecord(values: any) {
    setSelectedKioskDeposit(values);
    setOpenErrorMarketingRecord(!openBankRecord);
  }

  async function handleInsertError(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      ...values,
    };
    await LogApi(values?.type === "Kiosk Error" ? "/insert-kiosk-error-report" : "/insert-bank-error-report", object)
      .then(() => {
        form.resetFields();
        messageApi.open({
          type: "success",
          content: "Insert Success",
        });
        type === "Kiosk Error" ? handleGetKioskErrorReport(initialValues) : handleGetBankErrorReport(initialValues);
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
      UserType: userType,
      companyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      staffSrno: values?.staffSrno,
      remark: values?.remark,
      bankCode: values?.bankCode,
      searchCompanyID: values?.searchCompanyID,
    };
    await LogApi("/bank-error-report", object)
      .then((result) => {
        setApiData2(result.data);
        setKioskReportIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setKioskReportIsLoading(false);
  }

  async function handleGetKioskErrorReport(values: any) {
    setKioskReportIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      staffSrno: values?.staffSrno,
      gameName: values?.gameName,
      remark: values?.remark,
      type: values?.type,
      bankCode: values?.bankCode,
      searchCompanyID: values?.searchCompanyID,
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

  function handleOnChangeType(value: any) {
    form.setFieldValue("oriWithdraw", 0);
    form.setFieldValue("wrongWithdraw", 0);
    form.setFieldValue("errorWithdraw", 0);
    setType(value);
  }

  function handleOnChangeAmount() {
    const ori = form.getFieldValue("oriWithdraw") ?? 0;
    const wrong = form.getFieldValue("wrongWithdraw") ?? 0;

    form.setFieldValue("errorWithdraw", ori - wrong);
  }

  return { t, messageApi, contextHolder, userInfo, companyList, isLoading, isKioskReportLoading, form, allGameList, allStaffList, apiData, apiData2, selectedPendingDeposit, openBankRecord, setOpenBankRecord, openErrorMarketingRecord, setOpenErrorMarketingRecord, selectedKioskError, type, allBankList, initialValues, columns, bankColumns, handleGetBankErrorReport, handleGetKioskErrorReport, handleInsertError, handleOnChangeType, handleOnChangeAmount };
};
