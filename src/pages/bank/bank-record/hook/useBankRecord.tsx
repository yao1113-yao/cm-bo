import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import { Button, Form, Image, message, Space, TableProps, Tag } from "antd";
import { formatDateTime, formatIndex, formatNumber, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { bankApi } from "../../../../service/CallApi";
import { IBankRecordMarketingType, IDeviceType } from "../../../../type/main.interface";
import { getAllItemCodeList } from "../../../../function/ApiFunction";

import { EditOutlined } from "@ant-design/icons";

export const useBankRecord = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<IBankRecordMarketingType[] | undefined>();
  //   const [apiData2, setApiData2] = useState<ICompanyGPType[] | undefined>();
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();

  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    bank: "all",
    remark: "",
  };
  useEffect(() => {
    getAllItemCodeList("MBank", setIsLoading, setAllBankList);
    handleGetBankRecordMarketingList(initialValues);
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
        return <div style={{ fontWeight: "600" }}>{text === 1 ? <Tag color="#389e0d">{t("Done")}</Tag> : <Tag color="#f50">{t("Havent")}</Tag>}</div>;
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
      sorter: (a: any, b: any) => dayjs(a.createDate).diff(dayjs(b.createDate)),
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("action"),
      ellipsis: true,
      render: () => {
        return (
          <Space>
            <Button>
              <EditOutlined />
            </Button>
          </Space>
        );
      },
    },
  ];

  async function handleGetBankRecordMarketingList(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: "BEST1",
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
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
  function handleSearchByFilter(values: any) {
    console.log(values);
    if (values === "day") {
      form.setFieldValue("searchDate", searchDateRange(values));
      handleGetBankRecordMarketingList({ searchDate: searchDateRange(values), bank: form.getFieldValue("bank"), remark: form.getFieldValue("remark") });
    } else {
      form.setFieldValue("searchDate", [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")]);
      handleGetBankRecordMarketingList({ searchDate: [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")], bank: form.getFieldValue("bank"), remark: form.getFieldValue("remark") });
    }
  }

  return { t, form, isLoading, apiData, setApiData, allBankList, initialValues, columns, handleGetBankRecordMarketingList, handleSearchByFilter };
};
