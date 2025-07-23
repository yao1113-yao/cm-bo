import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import { Button, Form, message, Space, TableProps, Tooltip } from "antd";
import { formatNumber, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { bankApi } from "../../../../service/CallApi";
import { IGameProviderType, IKioskLogType } from "../../../../type/main.interface";

import { Api } from "../../../../context/ApiContext";
import { getAllGameProviderList } from "../../../../function/ApiFunction";
// import { getAllItem,CodeList } from "../../../../function/ApiFunction";

export const useKioskLog = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { subdomain } = useContext(Api);
  const [messageApi, contextHolder] = message.useMessage();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<IKioskLogType[]>([]);
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  const [userInput, setUserInput] = useState();
  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    gameName: "all",
  };
  useEffect(() => {
    // getAllItemCodeList("MBank", setIsLoading, setAllBankList);
    getAllGameProviderList(setIsLoading, setAllGameList);
    handleGetMatchBankLaterList(initialValues);
  }, []);

  const columns: TableProps<IKioskLogType>["columns"] = [
    {
      title: t("companyID"),
      dataIndex: "companyID",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("gameName"),
      dataIndex: "gameName",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("remark"),
      dataIndex: "remark",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("beforeBalance"),
      dataIndex: "beforeBalance",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },

    {
      title: t("afterBalance"),
      dataIndex: "afterBalance",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
  ];

  async function handleGetMatchBankLaterList(values: any) {
    setIsLoading(true);
    setUserInput(values);
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      gameName: values?.gameName,
    };
    await bankApi("/kiosk-log", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }
  function handleSearchByFilter(values: any) {
    console.log(values);
    if (values === "day") {
      form.setFieldValue("searchDate", searchDateRange(values));
      handleGetMatchBankLaterList({ searchDate: searchDateRange(values), bank: form.getFieldValue("bank"), remark: form.getFieldValue("remark") });
    } else {
      form.setFieldValue("searchDate", [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")]);
      handleGetMatchBankLaterList({ searchDate: [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")], bank: form.getFieldValue("bank"), remark: form.getFieldValue("remark") });
    }
  }

  return { t, form, messageApi, contextHolder, isLoading, apiData, setApiData, allGameList, userInput, initialValues, columns, handleGetMatchBankLaterList, handleSearchByFilter };
};
