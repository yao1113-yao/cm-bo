import { Form, message, TableProps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IDeviceType, ITeamCaseType } from "../../../../type/main.interface";
import { formatIndex, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { reportApi } from "../../../../service/CallApi";
import dayjs from "dayjs";
import { getAllItemCodeList } from "../../../../function/ApiFunction";

export const useDeviceCase = () => {
  const { t } = useTranslation();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITeamCaseType[] | undefined>();
  const [allDeviceList, setAllDeviceList] = useState<[IDeviceType] | undefined>();
  const [userInput, setUserInput] = useState<any>();

  const initialValues = {
    searchDate: searchDateRange("day"),
    deviceID: "all",
  };
  useEffect(() => {
    getAllItemCodeList("MDevice", setIsLoading, setAllDeviceList);

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
      deviceID: values?.deviceID,
    };
    await reportApi("/device-case", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }

  const columns: TableProps<ITeamCaseType>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },

    {
      title: t("deviceID"),
      dataIndex: "mDevice",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalCase"),
      dataIndex: "totalCase",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },

    {
      title: t("totalDepositCase"),
      dataIndex: "totalDepositCase",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalWithdrawCase"),
      dataIndex: "totalWithdrawCase",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalDeposit(RM)"),
      dataIndex: "totalDeposit",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "green" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalWithdraw(RM)"),
      dataIndex: "totalWithdraw",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "red" }}>{formatString(text)}</div>;
      },
    },
  ];

  return { t, form, isLoading, initialValues, columns, userInput, apiData, allDeviceList, handleGetTeamCase };
};
