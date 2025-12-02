import { Form, message, TableProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IDeviceType, ITeamCaseType } from "../../../../type/main.interface";
import { formatIndex, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { reportApi } from "../../../../service/CallApi";
import dayjs from "dayjs";
import { getAllItemCodeList } from "../../../../function/ApiFunction";
import { Api } from "../../../../context/ApiContext";

export const useDeviceCase = () => {
  const { t } = useTranslation();
  const { companyList } = useContext(Api);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITeamCaseType[] | undefined>();
  const [allDeviceList, setAllDeviceList] = useState<[IDeviceType] | undefined>();
  const [userInput, setUserInput] = useState<any>();

  const initialValues = {
    searchDate: searchDateRange("day"),
    companyID: "all",
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
      UserType: userType,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      deviceID: values?.deviceID,
      companyID: values?.companyID,
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
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("001W"),
      dataIndex: "m001W",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("002W"),
      dataIndex: "m002W",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("003W"),
      dataIndex: "m003W",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("004W"),
      dataIndex: "m004W",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("005W"),
      dataIndex: "m005W",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("006W"),
      dataIndex: "m006W",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("001T"),
      dataIndex: "m001T",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("002T"),
      dataIndex: "m002T",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("003T"),
      dataIndex: "m003T",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("004T"),
      dataIndex: "m004T",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("005T"),
      dataIndex: "m005T",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("006T"),
      dataIndex: "m006T",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
  ];

  return { t, companyList, form, isLoading, initialValues, columns, userInput, apiData, allDeviceList, handleGetTeamCase };
};
