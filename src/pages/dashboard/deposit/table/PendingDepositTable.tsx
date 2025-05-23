import { Button, Card, Divider, message, Space, Table, TableProps, Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { ITransactionType } from "../../../../type/main.interface";
import { formatDateTime, formatNumber, formatString } from "../../../../function/CommonFunction";
import { useContext, useRef, useState } from "react";
import { Api } from "../../../../context/ApiContext";

import { BankOutlined, EyeOutlined, SendOutlined, CloseOutlined } from "@ant-design/icons";
import { mainApi } from "../../../../service/CallApi";
import { FaHandPaper } from "react-icons/fa";
import OpenBankRecord from "./modal/OpenBankRecord";
import OpenManualSuccess from "./modal/OpenManualSuccess";
import Swal from "sweetalert2";

const PendingDepositTable = ({ pendingDepositRecod, handleGetPendingTransactionRecord, handleGetTransactionRecord }: any) => {
  const { t } = useTranslation();
  const { userInfo } = useContext(Api);

  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openBankRecord, setOpenBankRecord] = useState<boolean>(false);
  const [openManualSuccess, setOpenManualSuccess] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");
  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<ITransactionType | undefined>();
  const [bankRecord, setBankRecord] = useState<ITransactionType[] | undefined>([]);

  console.log(isLoading);

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("action"),
      hidden: userInfo?.userType === 3,
      render: (record: any) => {
        return (
          <>
            <Space>
              {!record?.bankRecordSrno ? (
                <>
                  <Tooltip title={t("assignBank")}>
                    <Button icon={<BankOutlined />} onClick={() => handleGetBankRecord(record)}></Button>
                  </Tooltip>

                  <Tooltip title={t("reject")}>
                    <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title={t("viewBank")}>
                    <Button icon={<EyeOutlined />} onClick={() => handleGetBankRecordDetails(record)}></Button>
                  </Tooltip>
                  {record?.mStatus === "WAITING" && (
                    <>
                      <Tooltip title={t("sendToBot")}>
                        <Button icon={<SendOutlined />} onClick={() => handleInsertDepositTask(record)}></Button>
                      </Tooltip>
                      <Tooltip title={t("manualSuccess")}>
                        <Button icon={<FaHandPaper />} onClick={() => handleOpenManualSuccessModal(record)}></Button>
                      </Tooltip>
                      <Tooltip title={t("reject")}>
                        <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                      </Tooltip>
                    </>
                  )}
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
      title: t("in"),
      dataIndex: "inCredit",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("bankIn"),
      dataIndex: "bankOut",
      align: "center",
      render: (text: number, record, index: number) => {
        if (index > 0 && record.mktSrno === pendingDepositRecod[index - 1]?.mktSrno) return <div>-</div>;
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
      title: t("bonus"),
      dataIndex: "bonus",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
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
    samePrev.current = index > 0 ? record.mktSrno === pendingDepositRecod[index - 1]?.mktSrno : true;
    if (index === 0) prevClass.current = "row-highlight-1";
    if (samePrev.current) return prevClass.current;
    else {
      prevClass.current = prevClass.current === "row-highlight-1" ? "row-highlight-2" : "row-highlight-1";
      return prevClass.current;
    }
  };

  async function handleGetBankRecord(values: any) {
    setIsLoading(true);
    setActionType("assign");
    const object = {
      UserID: userID,
      UserToken: userToken,
      Type: "Deposit",
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

  async function handleGetBankRecordDetails(values: any) {
    setIsLoading(true);
    setActionType("details");
    const object = {
      UserID: userID,
      UserToken: userToken,
      bankRecordSrno: values?.bankRecordSrno,
    };
    await mainApi("/bank-record-details", object)
      .then((result: any) => {
        setSelectedPendingDeposit(values);
        setOpenBankRecord(true);
        setBankRecord([result.data]);
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "",
        });
      });
    setIsLoading(false);
  }

  function handleInsertDepositTask(values: any) {
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
        await mainApi("/insert-deposit-task", object)
          .then(() => {
            setOpenBankRecord(false);
            handleGetPendingTransactionRecord("deposit");
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

  function handleOpenManualSuccessModal(values: any) {
    setOpenManualSuccess(true);
    setSelectedPendingDeposit(values);
  }

  function handleCloseManualSuccessModal() {
    setOpenManualSuccess(false);
    setSelectedPendingDeposit(undefined);
  }

  async function handleInsertManualSuccess(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      mktDetailsSrno: selectedPendingDeposit?.srno,
      gameID: values?.gameID,
    };
    await mainApi("/insert-manual-success", object)
      .then(() => {
        setOpenManualSuccess(false);
        setSelectedPendingDeposit(undefined);
        handleGetPendingTransactionRecord("deposit");
        handleGetTransactionRecord("deposit");
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
    setIsLoading(false);
  }

  async function handleRejectTransaction(values: any) {
    Swal.fire({
      title: "Do you want to rejcet this transaction?",
      showCancelButton: true,
      confirmButtonText: "Reject",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          mktDetailsSrno: values?.srno,
          status: 0,
        };
        await mainApi("/update-transaction-status", object)
          .then(() => {
            setOpenManualSuccess(false);
            setSelectedPendingDeposit(undefined);
            handleGetPendingTransactionRecord("deposit");
            handleGetTransactionRecord("deposit");
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
      <Divider>{t("pendingDepositTable")}</Divider>

      <Card>
        <Table columns={columns} dataSource={pendingDepositRecod} scroll={{ x: true }} pagination={false} rowClassName={rowClassName} rowHoverable={false} />
      </Card>

      {/* open bank list assign bank */}
      <OpenBankRecord messageApi={messageApi} selectedPendingDeposit={selectedPendingDeposit} actionType={actionType} bankRecord={bankRecord} openBankRecord={openBankRecord} setOpenBankRecord={setOpenBankRecord} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} />

      {/* manual success */}
      <OpenManualSuccess openManualSuccess={openManualSuccess} handleCloseManualSuccessModal={handleCloseManualSuccessModal} selectedPendingDeposit={selectedPendingDeposit} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleInsertManualSuccess={handleInsertManualSuccess} />
    </>
  );
};

export default PendingDepositTable;
