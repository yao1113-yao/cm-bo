import { Button, Card, Divider, message, Space, Table, TableProps, Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { ITransactionType } from "../../../../type/main.interface";
import { formatDateTime, formatNumber, formatString } from "../../../../function/CommonFunction";
import { useContext, useRef, useState } from "react";
import { Api } from "../../../../context/ApiContext";
import { BankOutlined } from "@ant-design/icons";
import { mainApi } from "../../../../service/CallApi";

const PendingWithdrawTable = ({ pendingWithdrawRecod }: any) => {
  const { t } = useTranslation();
  const { userInfo } = useContext(Api);
  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openBankRecord, setOpenBankRecord] = useState<boolean>(false);
  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<ITransactionType | undefined>();
  const [bankRecord, setBankRecord] = useState<ITransactionType[] | undefined>([]);

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("action"),
      hidden: userInfo?.userType === 3,
      render: (record) => {
        return (
          <>
            {record?.mStatus === "WAITING" && (
              <Space>
                <Tooltip title={t("assignBank")}>
                  <Button icon={<BankOutlined />} onClick={() => handleGetBankRecord(record)}></Button>
                </Tooltip>
              </Space>
            )}
          </>
        );
      },
    },
    {
      title: t("status"),
      dataIndex: "mStatus",
      align: "center",
      render: (text: string, record) => {
        return record?.isManual === 1 && text === "DONE" ? <Tag color="#13c2c2">MANUAL DONE</Tag> : <Tag color={text === "WAITING" ? "#2db7f5" : text === "HOLD" ? "#ad8b00" : text === "DONE" ? "#87d068" : text === "REJECT" ? "#f50" : text === "TOP UP" ? "#36cfc9" : ""}>{text}</Tag>;
      },
    },
    // {
    //   title: t("staff"),
    //   dataIndex: "mStaff",
    //   align: "center",
    //   render: (text: string) => {
    //     return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
    //   },
    // },
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
      title: t("outCredit"),
      dataIndex: "outCredit",
      align: "center",

      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("bankOut"),
      dataIndex: "bankOut",
      align: "center",

      render: (text: number) => {
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
      title: t("customerBank"),
      dataIndex: "customerBank",
      align: "center",

      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("customerBankAccNo"),
      dataIndex: "customerBankAccNo",
      align: "center",

      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("customerBankAccName"),
      dataIndex: "customerBankAccName",
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
      title: t("createDate"),
      dataIndex: "createDate",
      align: "center",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
  ];

  async function handleGetBankRecord(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      Type: "Withdraw",
      Bank: values?.mBank,
    };
    await mainApi("/bank-record", object)
      .then((result: any) => {
        setSelectedPendingDeposit(values);
        setOpenBankRecord(true);
        setBankRecord(result.data);
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setIsLoading(false);
  }

  const samePrev = useRef<boolean>(false);
  const prevClass = useRef<string>("row-highlight-1");

  const rowClassName = (record: any, index: number) => {
    samePrev.current = index > 0 ? record.mktSrno === pendingWithdrawRecod[index - 1]?.mktSrno : true;
    if (index === 0) prevClass.current = "row-highlight-1";
    if (samePrev.current) return prevClass.current;
    else {
      prevClass.current = prevClass.current === "row-highlight-1" ? "row-highlight-2" : "row-highlight-1";
      return prevClass.current;
    }
  };

  return (
    <>
      {contextHolder}
      <Divider>{t("pendingWithdrawRecord")}</Divider>

      <Card>
        <Table columns={columns} dataSource={pendingWithdrawRecod} scroll={{ x: true }} pagination={false} rowClassName={rowClassName} rowHoverable={false} />
      </Card>
    </>
  );
};

export default PendingWithdrawTable;
