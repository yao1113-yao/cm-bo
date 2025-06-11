import { Button, Card, Divider, Image, message, Modal, Table, TableProps, Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { ITransactionType } from "../../../../type/main.interface";
import { formatDateTime, formatNumber, formatString } from "../../../../function/CommonFunction";
import { useContext, useRef, useState } from "react";
import { FileImageOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { Api } from "../../../../context/ApiContext";
import { CheckOutlined } from "@ant-design/icons";
import { mainApi } from "../../../../service/CallApi";

const WithdrawTable = ({ withdrawRecod, handleGetPendingTransactionRecord, handleGetTransactionRecord }: any) => {
  const { t } = useTranslation();
  const { userInfo } = useContext(Api);
  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewReceipt, setViewReceipt] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ITransactionType | undefined>();

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: "action",
      render: (record: any) => {
        return (
          <>
            <Tooltip title={t("viewReceipt")}>
              <Button icon={<FileImageOutlined />} onClick={() => handleViewReceipt(record)}></Button>
            </Tooltip>

            {userInfo?.userType === 3 && record?.mStatus === "SUCCESS" ? (
              <Tooltip title={t("Noted")}>
                <Button onClick={() => handleNotedTransaction(record)}>
                  <CheckOutlined />
                </Button>
              </Tooltip>
            ) : (
              ""
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
        return record?.isManual === 1 && text === "SUCCESS" ? <Tag color="#13c2c2">MANUAL SUCCESS</Tag> : <Tag color={text === "WAITING" ? "#2db7f5" : text === "HOLD" ? "#ad8b00" : text === "SUCCESS" ? "#87d068" : text === "REJECT" ? "#f50" : text === "TOP UP" ? "#36cfc9" : ""}>{text}</Tag>;
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
      title: t("password"),
      dataIndex: "password",
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
  const samePrev = useRef<boolean>(false);
  const prevClass = useRef<string>("row-highlight-1");

  const rowClassName = (record: any, index: number) => {
    samePrev.current = index > 0 ? record.mktSrno === withdrawRecod[index - 1]?.mktSrno : true;
    if (index === 0) prevClass.current = "row-highlight-1";
    if (samePrev.current) return prevClass.current;
    else {
      prevClass.current = prevClass.current === "row-highlight-1" ? "row-highlight-2" : "row-highlight-1";
      return prevClass.current;
    }
  };

  console.log(selectedRecord);

  function handleViewReceipt(values: any) {
    setViewReceipt(true);
    setSelectedRecord(values);
  }

  async function handleNotedTransaction(values: any) {
    Swal.fire({
      title: "Confirm to noted the transaction?",
      showCancelButton: true,
      confirmButtonText: "Noted",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          mktDetailsSrno: values?.srno,
          status: 1,
        };
        await mainApi("/update-transaction-status", object)
          .then(() => {
            handleGetPendingTransactionRecord("withdraw");
            handleGetTransactionRecord("withdraw");
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
  return (
    <>
      {contextHolder}
      <Divider>{t("withdrawRecord")}</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={withdrawRecod} scroll={{ x: true }} pagination={false} rowClassName={rowClassName} rowHoverable={false} />
      </Card>

      <Modal open={viewReceipt} onCancel={() => setViewReceipt(false)} footer={null} closable={false}>
        <Image src={selectedRecord?.receiptUrl} alt="receipt" />
      </Modal>
    </>
  );
};

export default WithdrawTable;
