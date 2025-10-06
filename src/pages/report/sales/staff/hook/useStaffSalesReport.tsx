import { Form, message, TableProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatIndex, formatString, searchDateRange } from "../../../../../function/CommonFunction";
import { ITeamSalesDetailsType, ITotalValueType, IUserType } from "../../../../../type/main.interface";
import { reportApi } from "../../../../../service/CallApi";
import { getAllStaffList } from "../../../../../function/ApiFunction";
import { Api } from "../../../../../context/ApiContext";

export const useStaffSalesReport = () => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITeamSalesDetailsType[] | undefined>();
  const [apiData2, setApiData2] = useState<ITotalValueType | undefined>();
  const [userInput, setUserInput] = useState();
  const [allStaffList, setAllStaffList] = useState<[IUserType] | undefined>();

  const initialValues = {
    searchDate: searchDateRange("day"),
    staffSrno: 0,
  };
  useEffect(() => {
    getAllStaffList(setIsLoading, subdomain, setAllStaffList);
    handleGetTeamSalesDetails(initialValues);
  }, []);

  async function handleGetTeamSalesDetails(values: any) {
    setIsLoading(true);
    setUserInput(values);
    const object = {
      UserID: userID,
      UserToken: userToken,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      staffSrno: values?.staffSrno,
    };
    await reportApi("/staff-sales", object)
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

  const columns: TableProps<ITeamSalesDetailsType>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },
    {
      title: t("staffCode"),
      dataIndex: "userID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("cashierDeposit(RM)"),
      dataIndex: "cashierDeposit",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "green" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("cashierWithdraw(RM)"),
      dataIndex: "cashierWithdraw",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "red" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("marketingDeposit(RM)"),
      dataIndex: "marketingDeposit",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "green" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("marketingWithdraw(RM)"),
      dataIndex: "marketingWithdraw",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "red" }}>{formatString(text)}</div>;
      },
    },
  ];

  return { t, form, isLoading, userInput, allStaffList, initialValues, columns, apiData, apiData2, handleGetTeamSalesDetails };
};
