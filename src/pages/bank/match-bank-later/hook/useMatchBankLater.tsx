import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import { Button, Form, message, Space, TableProps, Tooltip } from "antd";
import { formatDateTime, formatNumber, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { bankApi } from "../../../../service/CallApi";
import { ITransactionType } from "../../../../type/main.interface";
import { BankOutlined, EditOutlined } from "@ant-design/icons";
import { handleEditingTransaction } from "../../../../function/ApiFunction";
// import { getAllItem,CodeList } from "../../../../function/ApiFunction";

export const useMatchBankLater = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITransactionType[]>([]);
  //   const [apiData2, setApiData2] = useState<ICompanyGPType[] | undefined>();
  //   const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();
  const [openBankRecord, setOpenBankRecord] = useState<boolean>(false);
  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<ITransactionType | undefined>();
  const [isCheckAllAmount, setIsCheckAllAmount] = useState<boolean>(false);
  const [openEditTransaction, setOpenEditTransaction] = useState<boolean>(false);
  const [userInput, setUserInput] = useState();
  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    remark: "",
  };
  useEffect(() => {
    // getAllItemCodeList("MBank", setIsLoading, setAllBankList);
    handleGetMatchBankLaterList(initialValues);
  }, []);

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("action"),
      align: "center",
      ellipsis: true,
      render: (record) => {
        return (
          <Space>
            <Tooltip title={t("assignBank")}>
              <Button icon={<BankOutlined />} onClick={() => OpenModalBankRecord(record)}></Button>
            </Tooltip>
            <Tooltip title={t("editDetails")}>
              <Button onClick={() => OpenModalEditTransaction(record)}>
                <EditOutlined />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: t("createDate"),
      dataIndex: "createDate",
      align: "center",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("recordType"),
      dataIndex: "recordType",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{text === "MAIN" ? "DEPOSIT" : formatString(text)}</div>;
      },
    },
    {
      title: t("staff"),
      dataIndex: "mStaff",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("game"),
      dataIndex: "mGame",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("gameID"),
      dataIndex: "gameID",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("password"),
      dataIndex: "password",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("name"),
      dataIndex: "name",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("hpNo"),
      dataIndex: "hpNo",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("device"),
      dataIndex: "mDevice",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankIn"),
      dataIndex: "credit",
      align: "center",
      render: (text: number, record, index: number) => {
        if (index > 0 && record.mktSrno !== 0 && record.mktSrno === apiData[index - 1]?.mktSrno) return <div>-</div>;
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("bankOut"),
      dataIndex: "debit",
      align: "center",
      render: (text: number, record, index: number) => {
        if (index > 0 && record.mktSrno !== 0 && record.mktSrno === apiData[index - 1]?.mktSrno) return <div>-</div>;
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("bank"),
      dataIndex: "mBank",
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
      title: t("bonus") + "%",
      dataIndex: "bonusPer",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text * 100)}</div>;
      },
    },
    {
      title: t("bonus") + "%",
      dataIndex: "bonusPer",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text * 100)}</div>;
      },
    },
    {
      title: t("total"),
      dataIndex: "total",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("freeCredit"),
      dataIndex: "freeCredit",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("cuci"),
      dataIndex: "cuci",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
  ];

  function OpenModalEditTransaction(values: any) {
    setSelectedPendingDeposit(values);
    setOpenEditTransaction(true);
    handleEditingTransaction(values, 1);
  }

  function OpenModalBankRecord(values: any) {
    setSelectedPendingDeposit(values);
    setOpenBankRecord(!openBankRecord);
  }

  const samePrev = useRef<boolean>(false);
  const prevClass = useRef<string>("row-highlight-1");

  const rowClassName = (record: any, index: number) => {
    samePrev.current = index > 0 ? record.mktSrno === apiData[index - 1]?.mktSrno : true;
    if (index === 0) prevClass.current = "row-highlight-1";
    if (samePrev.current) return prevClass.current;
    else {
      prevClass.current = prevClass.current === "row-highlight-1" ? "row-highlight-2" : "row-highlight-1";
      return prevClass.current;
    }
  };

  async function handleGetMatchBankLaterList(values: any) {
    setIsLoading(true);
    setUserInput(values);
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: "BEST8",
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      remark: values?.remark,
    };
    await bankApi("/match-bank-later", object)
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

  return { t, form, messageApi, contextHolder, isLoading, apiData, setApiData, userInput, openBankRecord, setOpenBankRecord, openEditTransaction, setOpenEditTransaction, selectedPendingDeposit, isCheckAllAmount, setIsCheckAllAmount, initialValues, columns, handleGetMatchBankLaterList, handleSearchByFilter, rowClassName };
};
