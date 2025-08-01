import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import { Form, message, TableProps, Tag } from "antd";
import { formatDateTime, formatNumber, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { bankApi } from "../../../../service/CallApi";
import { ITransactionType } from "../../../../type/main.interface";
import { Api } from "../../../../context/ApiContext";

export const useTransferRecord = () => {
  const { userInfo, subdomain } = useContext(Api);

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITransactionType[]>([]);
  //   const [apiData2, setApiData2] = useState<ICompanyGPType[] | undefined>();

  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    companyID: "all",
    gameName: "all",
    gameLoginID: "",
    toGameName: "all",
    toGameLoginID: "",
    remark: "",
  };
  useEffect(() => {
    handleGetTransferRecordMarketing(initialValues);
  }, []);

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("createDate"),
      dataIndex: "createDate",
      ellipsis: true,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
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
      title: t("status"),
      dataIndex: "mStatus",
      ellipsis: true,
      render: (text: string, record) => {
        return record?.isManual === 1 && text === "DONE" ? <Tag color="#13c2c2">MANUAL DONE</Tag> : <Tag color={text === "WAITING" ? "#2db7f5" : text === "HOLD" ? "#ad8b00" : text === "DONE" ? "#87d068" : text === "REJECT" ? "#f50" : text === "TOP UP" ? "#36cfc9" : ""}>{text}</Tag>;
      },
    },
    {
      title: t("freeCredit"),
      dataIndex: "isFreeCredit",
      ellipsis: true,
      render: (text) => {
        return text === 1 ? <Tag color="#108ee9">Free Credit</Tag> : "-";
      },
    },
    {
      title: t("mGame"),
      dataIndex: "mGame",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("gameID"),
      dataIndex: "gameID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("password"),
      dataIndex: "password",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("in"),
      dataIndex: "inCredit",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("out"),
      dataIndex: "outCredit",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },

    // {
    //   title: t("action"),
    //   ellipsis: true,
    //   render: () => {
    //     return (
    //       <Space>
    //         <Button>
    //           <EditOutlined />
    //         </Button>
    //       </Space>
    //     );
    //   },
    // },
  ];

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

  async function handleGetTransferRecordMarketing(values: any) {
    setIsLoading(true);
    console.log(values);
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: userInfo?.userType === 2 ? subdomain : values?.companyID,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      keyword: values?.keyword,
    };
    await bankApi("/transfer-record", object)
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
    if (values === "day") {
      form.setFieldValue("searchDate", searchDateRange(values));
      handleGetTransferRecordMarketing({ searchDate: searchDateRange(values), gameName: form.getFieldValue("gameName"), gameLoginID: form.getFieldValue("gameLoginID"), toGameName: form.getFieldValue("toGameName"), toGameLoginID: form.getFieldValue("toGameLoginID") });
    } else {
      form.setFieldValue("searchDate", [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")]);
      handleGetTransferRecordMarketing({ searchDate: [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")], gameName: form.getFieldValue("gameName"), gameLoginID: form.getFieldValue("gameLoginID"), toGameName: form.getFieldValue("toGameName"), toGameLoginID: form.getFieldValue("toGameLoginID") });
    }
  }

  return { userInfo, t, form, isLoading, apiData, setApiData, initialValues, columns, handleGetTransferRecordMarketing, rowClassName, handleSearchByFilter };
};
