import { Form, message, TableProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { Api } from "../../../../context/ApiContext";
import { IRebateRecordType } from "../../../../type/main.interface";
import { useTranslation } from "react-i18next";
import { formatNumber, formatString } from "../../../../function/CommonFunction";
import dayjs from "dayjs";
import { bankApi } from "../../../../service/CallApi";

export const useRebateRecord = () => {
  const { userInfo, subdomain } = useContext(Api);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // const [messageApi, contextHolder] = message.useMessage();
  const [userInput, setUserInput] = useState<any>();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<IRebateRecordType[]>([]);
  const initialValues = {
    searchDate: [dayjs().startOf("days"), dayjs().endOf("days")],
  };

  useEffect(() => {
    handleGetRebateRecord(initialValues);
  }, []);

  const columns: TableProps<IRebateRecordType>["columns"] = [
    {
      title: t("game"),
      dataIndex: "mGame",
      ellipsis: true,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("gameID"),
      dataIndex: "gameID",
      ellipsis: true,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("name"),
      dataIndex: "name",
      ellipsis: true,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("hpNo"),
      dataIndex: "hpNo",
      ellipsis: true,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("device"),
      dataIndex: "mDevice",
      ellipsis: true,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("freePoint"),
      dataIndex: "freePoint",
      ellipsis: true,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600", background: text === 1 ? "yellow" : "" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("minCuci"),
      dataIndex: "minCuci",
      ellipsis: true,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("maxCuci"),
      dataIndex: "maxCuci",
      ellipsis: true,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("in"),
      dataIndex: "in",
      ellipsis: true,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("out"),
      dataIndex: "out",
      ellipsis: true,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("winLoss"),
      dataIndex: "winLoss",
      ellipsis: true,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("rebate(%)"),
      dataIndex: "rebatePercentage",
      ellipsis: true,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("rebateAmount"),
      dataIndex: "rebateAmount",
      ellipsis: true,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
  ];

  async function handleGetRebateRecord(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      // bankCode: values?.bank,
      // remark: values?.remark,
    };
    setUserInput(values);
    await bankApi("/rebate-record", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }

  return { userInfo, t, form, isLoading, apiData, userInput, columns, initialValues, handleGetRebateRecord };
};
