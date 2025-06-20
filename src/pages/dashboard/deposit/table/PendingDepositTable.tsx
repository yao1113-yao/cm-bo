import { Button, Card, Divider, message, Space, Spin, Table, TableProps, Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { ITransactionType } from "../../../../type/main.interface";
import { formatDateTime, formatNumber, formatString } from "../../../../function/CommonFunction";
import { useContext, useRef, useState } from "react";
import { Api } from "../../../../context/ApiContext";

import { BankOutlined, SendOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { mainApi } from "../../../../service/CallApi";
import { FaHandPaper } from "react-icons/fa";
import OpenBankRecord from "./modal/OpenBankRecord";
import OpenManualSuccess from "./modal/OpenManualSuccess";
import Swal from "sweetalert2";
import { MdOutlineWatchLater } from "react-icons/md";
import EditTransaction from "./modal/EditTransaction";
import { handleEditingTransaction } from "../../../../function/ApiFunction";

const PendingDepositTable = ({ pendingDepositRecod, handleGetPendingTransactionRecord, handleGetTransactionRecord }: any) => {
  const { t } = useTranslation();
  const { userInfo } = useContext(Api);

  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openBankRecord, setOpenBankRecord] = useState<boolean>(false);
  const [openManualSuccess, setOpenManualSuccess] = useState<boolean>(false);
  const [openEditTransaction, setOpenEditTransaction] = useState<boolean>(false);
  const [isCheckAllAmount, setIsCheckAllAmount] = useState<boolean>(false);

  const [isLater, setIsLater] = useState<number>(0);
  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<ITransactionType | undefined>();

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("action"),
      hidden: userInfo?.userType !== 3,
      render: (record: any) => {
        return (
          <Space>
            {record?.mStatus !== "BOT PROCESSING" && record?.mStatus !== "REJECT" && (
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
            )}
          </Space>
        );
      },
    },
    {
      title: t("action"),
      hidden: userInfo?.userType === 3,
      render: (record: any) => {
        return (
          <>
            <Space>
              {!record?.bankRecordSrno && record?.mStatus !== "BOT PROCESSING" ? (
                <>
                  <Tooltip title={t("assignBank")}>
                    <Button icon={<BankOutlined />} onClick={() => OpenModalBankRecord(record)} disabled={record?.isEditing === 1}></Button>
                  </Tooltip>
                  {record?.isLater === 0 && (
                    <Tooltip title={t("matchBankLater")}>
                      <Button icon={<MdOutlineWatchLater />} onClick={() => handleMatchBankLater(record)} disabled={record?.isEditing === 1}></Button>
                    </Tooltip>
                  )}

                  <Tooltip title={t("reject")}>
                    <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                  </Tooltip>
                  {record?.mStatus !== "PROCESSING" ||
                    (record?.mStatus !== "BOT PROCESSING" && (
                      <Tooltip title={t("reject")}>
                        <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                      </Tooltip>
                    ))}
                </>
              ) : (
                <>
                  {record?.mStatus === "PROCESSING" && (
                    <>
                      <Tooltip title={t("assignBank")}>
                        <Button icon={<BankOutlined />} onClick={() => OpenModalBankRecord(record)} disabled={record?.isEditing === 1}></Button>
                      </Tooltip>
                      <Tooltip title={t("sendToBot")}>
                        <Button icon={<SendOutlined />} onClick={() => handleInsertDepositTask(record, "sendToBot")} disabled={record?.isEditing === 1}></Button>
                      </Tooltip>
                      <Tooltip title={t("manualSuccess")}>
                        <Button icon={<FaHandPaper />} onClick={() => handleOpenManualSuccessModal(record)} disabled={record?.isEditing === 1}></Button>
                      </Tooltip>
                      <Tooltip title={t("reject")}>
                        <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                      </Tooltip>
                    </>
                  )}

                  {record?.mStatus === "FAIL" && (
                    <Tooltip title={t("manualSuccess")}>
                      <Button icon={<FaHandPaper />} onClick={() => handleOpenManualSuccessModal(record)}></Button>
                    </Tooltip>
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
        return record?.isManual === 1 && text === "DONE" ? <Tag color="#13c2c2">MANUAL SUCCESS</Tag> : <Tag color={text === "WAITING" ? "#2db7f5" : text === "HOLD" ? "#ad8b00" : text === "REJECT" ? "#f50" : text === "TOP UP" ? "#36cfc9" : text === "PROCESSING" ? "#4096ff" : text === "BOT PROCESSING" ? "#9254de" : ""}>{text === "DONE" ? "SUCCESS" : text}</Tag>;
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

  function OpenModalBankRecord(values: any) {
    setSelectedPendingDeposit(values);
    setOpenBankRecord(!openBankRecord);
  }

  function OpenModalEditTransaction(values: any) {
    setSelectedPendingDeposit(values);
    setOpenEditTransaction(true);
    handleEditingTransaction(values, 1);
  }

  function handleInsertDepositTask(values: any, type: string) {
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
          IsLater: type === "sendToBot" ? 0 : 1,
        };
        await mainApi("/insert-deposit-task", object)
          .then(() => {
            setOpenBankRecord(false);
            setOpenManualSuccess(false);
            setSelectedPendingDeposit(undefined);
            setIsLater(0);
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

  function handleMatchBankLater(values: any) {
    Swal.fire({
      title: "Please confirm that later will match the transaction!",
      showCancelButton: true,
      showDenyButton: true,
      html: `<p style="color:red"}>*Reminder : <br>Please match bank record later</p>`,
      confirmButtonText: "Send To Bot",
      denyButtonText: "Manual Success",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);

        const object = {
          UserID: userID,
          UserToken: userToken,
          mktDetailsSrno: values?.srno,
          IsLater: 1,
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
      } else if (result.isDenied) {
        setIsLater(1);
        handleOpenManualSuccessModal(values);
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
    setIsLater(0);
  }

  async function handleInsertManualSuccess(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      mktDetailsSrno: selectedPendingDeposit?.srno,
      gameID: values?.gameID,
      hpNo: values?.hpNo,
      isLater: isLater,
    };
    await mainApi("/insert-manual-success", object)
      .then(() => {
        setOpenManualSuccess(false);
        setSelectedPendingDeposit(undefined);
        setIsLater(0);
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
      <Spin spinning={isLoading}>
        {contextHolder}
        <Divider>{t("pendingDepositTable")}</Divider>

        <Card>
          <Table columns={columns} dataSource={pendingDepositRecod} scroll={{ x: true }} pagination={false} rowClassName={rowClassName} rowHoverable={false} />
        </Card>

        {/* open bank list assign bank */}
        {openBankRecord && <OpenBankRecord messageApi={messageApi} isCheckAllAmount={isCheckAllAmount} setIsCheckAllAmount={setIsCheckAllAmount} selectedPendingDeposit={selectedPendingDeposit} openBankRecord={openBankRecord} setOpenBankRecord={setOpenBankRecord} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} />}

        {/* edit transaction */}
        {openEditTransaction && <EditTransaction messageApi={messageApi} openEditTransaction={openEditTransaction} selectedPendingDeposit={selectedPendingDeposit} setOpenEditTransaction={setOpenEditTransaction} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} />}

        {/* manual success */}
        <OpenManualSuccess openManualSuccess={openManualSuccess} handleCloseManualSuccessModal={handleCloseManualSuccessModal} selectedPendingDeposit={selectedPendingDeposit} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleInsertManualSuccess={handleInsertManualSuccess} />
      </Spin>
    </>
  );
};

export default PendingDepositTable;
