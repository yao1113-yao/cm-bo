import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import { Button, Form, message, Space, TableProps, Tag, Tooltip } from "antd";
import { formatDateTime, formatNumber, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { bankApi, mainApi } from "../../../../service/CallApi";
import { IDeviceType, ITransactionType } from "../../../../type/main.interface";
import { getAllItemCodeList } from "../../../../function/ApiFunction";
import { CloseOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { Api } from "../../../../context/ApiContext";

export const useBankRecord = () => {
  const { userInfo } = useContext(Api);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITransactionType[]>([]);
  //   const [apiData2, setApiData2] = useState<ICompanyGPType[] | undefined>();
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();

  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    companyID: "all",
    bank: "all",
    type: "all",
    remark: "",
  };
  useEffect(() => {
    getAllItemCodeList("MBank", setIsLoading, setAllBankList);
    handleGetBankRecordMarketingList(initialValues);
  }, []);

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("action"),
      align: "center",
      ellipsis: true,
      render: (record) => {
        return (
          record?.status === 1 && (
            <Space>
              <Tooltip title={t("takeOutBank")}>
                <Button icon={<CloseOutlined />} onClick={() => handleTakeOutBankTransaction(record)}></Button>
              </Tooltip>

              <Tooltip title={t("ShowRecordToMkt")}>
                <Button onClick={() => handleShowRecord(record)}>
                  <ClockCircleOutlined />
                </Button>
              </Tooltip>
            </Space>
          )
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
      title: t("status"),
      dataIndex: "status",
      align: "center",
      render: (text: number) => {
        return text === 1 ? <Tag color="#87d068">Assign</Tag> : <Tag color="#f50">Haven't</Tag>;
      },
    },
    {
      title: t("companyID"),
      dataIndex: "companyID",
      align: "center",
      hidden: userInfo && userInfo?.userType === 2,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("recordType"),
      dataIndex: "recordType",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{text === "Main" ? "DEPOSIT" : formatString(text)}</div>;
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
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
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

  async function handleShowRecord(values: any) {
    Swal.fire({
      title: "Confirm show the record to MKT?",
      showCancelButton: true,
      confirmButtonText: "Show",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          mktDetailsSrno: values?.mktDetailsSrno,
        };
        await mainApi("/show-record", object)
          .then(() => {
            handleGetBankRecordMarketingList(initialValues);
            messageApi.open({
              type: "success",
              content: "done",
            });
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: "",
            });
          });
      }

      setIsLoading(false);
    });
  }

  async function handleTakeOutBankTransaction(values: any) {
    Swal.fire({
      title: "Do you want to take out the bank?",
      showCancelButton: true,
      confirmButtonText: "Take out",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          mktSrno: values?.mktSrno,
        };
        await bankApi("/take-out-bank", object)
          .then(() => {
            handleGetBankRecordMarketingList(initialValues);
            messageApi.open({
              type: "success",
              content: "done",
            });
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: "",
            });
          });
      }

      setIsLoading(false);
    });
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

  async function handleGetBankRecordMarketingList(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: userInfo?.userType === 2 ? "BEST8" : values?.companyID,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      type: values?.type,
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
      handleGetBankRecordMarketingList({ searchDate: searchDateRange(values), type: form.getFieldValue("type"), bank: form.getFieldValue("bank"), remark: form.getFieldValue("remark") });
    } else {
      form.setFieldValue("searchDate", [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")]);
      handleGetBankRecordMarketingList({ searchDate: [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")], type: form.getFieldValue("type"), bank: form.getFieldValue("bank"), remark: form.getFieldValue("remark") });
    }
  }

  return { t, userInfo, form, contextHolder, isLoading, apiData, setApiData, allBankList, initialValues, columns, handleGetBankRecordMarketingList, handleSearchByFilter, rowClassName };
};
