import { Form, message, TableProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Api } from "../../../../context/ApiContext";
import dayjs from "dayjs";
import { bankApi } from "../../../../service/CallApi";
import { IBankRecordHaventAssign, ICompanyBankType } from "../../../../type/main.interface";
import { formatDateTime, formatNumber, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { getAllBankList } from "../../../../function/ApiFunction";

export const useBankRecordHaventAssign = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { subdomain, userInfo, companyList } = useContext(Api);
  const [messageApi, contextHolder] = message.useMessage();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allBankList, setAllBankList] = useState<[ICompanyBankType] | undefined>();
  const [apiData, setApiData] = useState<IBankRecordHaventAssign[]>([]);

  const initialValues = {
    searchDate: searchDateRange("day"),
    searchCompanyID: "all",
    bankCode: "all",
    bankRemark: "",
    bankAmount: 0,
  };

  useEffect(() => {
    getAllBankList(subdomain, "", setIsLoading, setAllBankList);
  }, []);

  async function handleGetBankRecordHaventAssingList(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      searchCompanyID: values?.searchCompanyID,
      bankCode: values?.bankCode,
      bankRemark: values?.bankRemark,
      bankAmount: values?.bankAmount,
    };
    await bankApi("/bank-record-havent-assign-list", object)
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
    setIsLoading(false);
  }

  const columns: TableProps<IBankRecordHaventAssign>["columns"] = [
    {
      title: "createDate",
      dataIndex: "createDate",
      align: "center",
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: "companyID",
      dataIndex: "companyID",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: "bankCode",
      dataIndex: "bankCode",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: "bankDate",
      dataIndex: "bankDate",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: "bankRemark",
      dataIndex: "bankRemark",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("debit"),
      dataIndex: "debit",
      hidden: false,
      align: "center",
      render: (text: number, record) => {
        return <div style={{ fontWeight: "600", color: text > 0 ? (record?.bankCode === "PMY" ? "green" : "red") : "" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("credit"),
      dataIndex: "credit",
      hidden: false,
      align: "center",
      render: (text: number, record) => {
        return <div style={{ fontWeight: "600", color: text > 0 ? (record?.bankCode === "PMY" ? "red" : "green") : "" }}>{formatNumber(text)}</div>;
      },
    },
  ];

  return { t, form, contextHolder, userInfo, companyList, isLoading, apiData, allBankList, initialValues, columns, handleGetBankRecordHaventAssingList };
};
