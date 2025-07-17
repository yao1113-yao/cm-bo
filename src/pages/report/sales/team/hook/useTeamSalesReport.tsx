import { Form, message, TableProps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatIndex, formatNumber, formatString, searchDateRange } from "../../../../../function/CommonFunction";
import { ITeamStaffSalesType, ITotalValueType } from "../../../../../type/main.interface";
import { reportApi } from "../../../../../service/CallApi";

export const useTeamSalesReport = () => {
  const { t } = useTranslation();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITeamStaffSalesType[] | undefined>();
  const [apiData2, setApiData2] = useState<ITotalValueType | undefined>();
  const [userInput, setUserInput] = useState();

  const initialValues = {
    searchDate: searchDateRange("day"),
    companyID: "all",
  };
  useEffect(() => {
    handleGetTeamCase(initialValues);
  }, []);

  async function handleGetTeamCase(values: any) {
    setIsLoading(true);
    setUserInput(values);
    const object = {
      UserID: userID,
      UserToken: userToken,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      companyID: values?.companyID,
      staffCode: values?.staffCode,
    };
    await reportApi("/team-staff-sales", object)
      .then((result) => {
        setApiData(result.data);
        setApiData2(result.data2);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }

  const columns: TableProps<ITeamStaffSalesType>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },
    {
      title: t("companyID"),
      dataIndex: "companyID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalCase"),
      dataIndex: "totalCase",
      ellipsis: true,
      sorter: (a, b) => a.totalCase - b.totalCase,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalDeposit(RM)"),
      dataIndex: "deposit",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "green" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalWithdraw(RM)"),
      dataIndex: "withdraw",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "red" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalProfit(RM)"),
      ellipsis: true,
      render: (record) => {
        return <div style={{ fontWeight: "600", color: record?.deposit - record?.withdraw > 0 ? "green" : record?.deposit - record?.withdraw < 0 ? "red" : "black" }}>{formatNumber(record?.deposit - record?.withdraw)}</div>;
      },
    },
  ];

  return { t, form, isLoading, userInput, initialValues, columns, apiData, apiData2, handleGetTeamCase };
};
