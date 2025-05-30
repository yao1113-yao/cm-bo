import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import { Image, message, TableProps } from "antd";
import { formatDateTime, formatIndex, formatNumber, formatStatus, formatString } from "../../../../function/CommonFunction";
import { bankApi } from "../../../../service/CallApi";
import { IBankRecordMarketingType, IDeviceType } from "../../../../type/main.interface";
import { getAllItemCodeList } from "../../../../function/ApiFunction";

export const useBankRecord = () => {
  const { t } = useTranslation();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<IBankRecordMarketingType[] | undefined>();
  //   const [apiData2, setApiData2] = useState<ICompanyGPType[] | undefined>();
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();

  const initialValues = {
    searchDate: [dayjs(), dayjs()],
    bankCode: "",
    remark: "",
  };
  useEffect(() => {
    getAllItemCodeList("MBank", setIsLoading, setAllBankList);
  }, []);

  const columns: TableProps<IBankRecordMarketingType>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
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
      title: t("bankDate"),
      dataIndex: "bankDate",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankRemark"),
      dataIndex: "bankRemark",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankAmount"),
      dataIndex: "bankAmount",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("debit"),
      dataIndex: "debit",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("credit"),
      dataIndex: "credit",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("status"),
      dataIndex: "status",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatStatus(text, t)}</div>;
      },
    },
    {
      title: t("receiptUrl"),
      dataIndex: "receiptUrl",
      ellipsis: true,
      render: (text: string) => {
        return <Image src={text} alt="receipt" />;
      },
    },
    {
      title: t("createDate"),
      dataIndex: "createDate",
      ellipsis: true,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("action"),
      ellipsis: true,
      render: () => {
        return <></>;
      },
    },
  ];

  async function handleGetBankRecordMarketingList(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: "BEST1",
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD"),
      bankCode: values?.bank,
      remark: values?.remark,
    };
    await bankApi("/bank-marketing-list", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }

  return { t, isLoading, apiData, setApiData, allBankList, initialValues, columns, handleGetBankRecordMarketingList };
};
