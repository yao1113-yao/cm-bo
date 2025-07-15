import { Button, Card, Divider, message, Space, Spin, Table, TableProps, Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { ITransactionType } from "../../../../type/main.interface";
import { formatDateTime, formatNumber, formatString } from "../../../../function/CommonFunction";
import { useContext, useRef, useState } from "react";
import { Api } from "../../../../context/ApiContext";
import { SendOutlined, CloseOutlined, UploadOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { mainApi } from "../../../../service/CallApi";
import OpenBankRecord from "./modal/OpenBankRecord";
import Swal from "sweetalert2";
import { FaHandPaper } from "react-icons/fa";
import EditTransaction from "./modal/EditTransaction";
import { handleEditingTransaction } from "../../../../function/ApiFunction";

const PendingWithdrawTable = ({ pendingWithdrawRecod, handleGetPendingTransactionRecord, handleGetTransactionRecord }: any) => {
  const { t } = useTranslation();
  const { userInfo } = useContext(Api);
  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openBankRecord, setOpenBankRecord] = useState<boolean>(false);
  const [openEditTransaction, setOpenEditTransaction] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<number>(0);
  const [isLater, setIsLater] = useState<number>(0);
  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<ITransactionType | undefined>();
  const [bankRecord, setBankRecord] = useState<ITransactionType[] | undefined>([]);
  console.log(bankRecord);
  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("action"),
      hidden: userInfo?.userType !== 3,
      render: (record: any) => {
        return (
          <Space>
            {record?.mStatus !== "BOT PROCESSING" && record?.mStatus !== "HOLD" && record?.mStatus !== "SUCCESS" && record?.mStatus !== "REJECT" ? (
              <>
                <Tooltip title={t("reject")}>
                  <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                </Tooltip>

                <Tooltip title={t("editDetails")}>
                  <Button onClick={() => OpenModalEditTransaction(record)}>
                    <EditOutlined />
                  </Button>
                </Tooltip>
              </>
            ) : record?.mStatus === "SUCCESS" ? (
              <Tooltip title={t("Noted")}>
                <Button onClick={() => handleNotedTransaction(record)}>
                  <CheckOutlined />
                </Button>
              </Tooltip>
            ) : record?.mStatus === "REJECT" ? (
              <>
                <Tooltip title={t("Noted")}>
                  <Button onClick={() => handleNotedTransaction(record)}>
                    <CheckOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title={t("editDetails")}>
                  <Button onClick={() => OpenModalEditTransaction(record)}>
                    <EditOutlined />
                  </Button>
                </Tooltip>
              </>
            ) : (
              ""
            )}
          </Space>
        );
      },
    },
    {
      title: t("action"),
      hidden: userInfo?.userType === 3,
      render: (record) => {
        return (
          <>
            <Space>
              {record?.mStatus === "WAITING" && (
                <>
                  <Tooltip title={t("approve")}>
                    <Button icon={<SendOutlined />} onClick={() => handleInsertWithdrawTask(record)} disabled={record?.isEditing === 1 || record?.bankAccountStatus === 3}></Button>
                  </Tooltip>
                  <Tooltip title={t("manualSuccess")}>
                    <Button icon={<FaHandPaper />} onClick={() => handleGetBankRecord(record, "manualSucccess")} disabled={record?.isEditing === 1 || record?.bankAccountStatus === 3}></Button>
                  </Tooltip>
                  <Tooltip title={t("reject")}>
                    <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                  </Tooltip>
                </>
              )}
              {record?.mStatus === "HOLD" && (
                <Tooltip title={t("upload")}>
                  <Button icon={<UploadOutlined />} onClick={() => handleGetBankRecord(record, "upload")}></Button>
                </Tooltip>
              )}
              {record?.mStatus === "BOT FAIL" && (
                <>
                  <Tooltip title={t("manualSuccess")}>
                    <Button icon={<FaHandPaper />} onClick={() => handleGetBankRecord(record, "manualSucccess")} disabled={record?.isEditing === 1 || record?.bankAccountStatus === 3}></Button>
                  </Tooltip>
                  <Tooltip title={t("reject")}>
                    <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                  </Tooltip>
                </>
              )}
            </Space>
          </>
        );
      },
    },
    {
      title: t("status"),
      dataIndex: "mStatus",
      align: "center",
      render: (text: string, record) => {
        return record?.isManual === 1 && text === "DONE" ? <Tag color="#13c2c2">MANUAL SUCCESS</Tag> : <Tag color={text === "WAITING" ? "#2db7f5" : text === "HOLD" ? "#ad8b00" : text === "DONE" ? "#87d068" : text === "REJECT" ? "#f50" : text === "PROCESSING" ? "#4096ff" : text === "TOP UP" ? "#36cfc9" : ""}>{text}</Tag>;
      },
    },
    {
      title: t("systemRemark"),
      dataIndex: "sysRemark1",
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
      title: t("bankChecking"),
      dataIndex: "bankAccountStatus",
      align: "center",

      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{text === 0 ? <div style={{ color: "green" }}>SAFE</div> : text === 2 ? <div style={{ color: "yellow" }}>Suka Scam</div> : <div style={{ color: "red" }}>BlackList</div>}</div>;
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
  function OpenModalEditTransaction(values: any) {
    setSelectedPendingDeposit(values);
    setOpenEditTransaction(true);
    handleEditingTransaction(values, 1);
  }

  function handleInsertWithdrawTask(values: any) {
    Swal.fire({
      title: "Do you want to send the request to bot?",
      showCancelButton: true,
      confirmButtonText: "Send",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          mktDetailsSrno: values?.srno,
        };
        await mainApi("/insert-withdraw-task", object)
          .then(() => {
            handleGetPendingTransactionRecord("withdraw");
            messageApi.open({
              type: "success",
              content: "sent",
            });
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: "",
            });
          });
        setIsLoading(false);
      }
    });
  }

  async function handleGetBankRecord(values: any, type: string) {
    setIsLoading(true);
    if (type === "manualSucccess") {
      setIsManual(1);
    }
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

  async function handleRejectTransaction(values: any) {
    Swal.fire({
      title: "Do you want to rejcet this transaction?",
      showCancelButton: true,
      text: "Remark:",
      input: "text",
      inputValue: values?.remark,
      confirmButtonText: "Reject",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          mktDetailsSrno: values?.srno,
          status: 0,
          remark: result.value,
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
      <Spin spinning={isLoading}>
        {contextHolder}
        <Divider>{t("pendingWithdrawRecord")}</Divider>

        <Card>
          <Table columns={columns} dataSource={pendingWithdrawRecod} scroll={{ x: true }} pagination={false} rowClassName={rowClassName} rowHoverable={false} />
        </Card>

        <OpenBankRecord messageApi={messageApi} selectedPendingDeposit={selectedPendingDeposit} openBankRecord={openBankRecord} setOpenBankRecord={setOpenBankRecord} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} isLater={isLater} setIsLater={setIsLater} isManual={isManual} setIsManual={setIsManual} />

        {/* edit transaction */}
        <EditTransaction messageApi={messageApi} selectedPendingDeposit={selectedPendingDeposit} openEditTransaction={openEditTransaction} setOpenEditTransaction={setOpenEditTransaction} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} />

        {/* manual success */}
      </Spin>
    </>
  );
};

export default PendingWithdrawTable;
