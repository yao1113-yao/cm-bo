import { Button, Card, Divider, message, Space, Spin, Table, TableProps, Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { ITransactionType } from "../../../../type/main.interface";
import { formatDateTime, formatNumber, formatString } from "../../../../function/CommonFunction";
import { SendOutlined, CloseOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { Api } from "../../../../context/ApiContext";
import { FaHandPaper } from "react-icons/fa";
import { useContext, useRef, useState } from "react";
import Swal from "sweetalert2";
import { mainApi } from "../../../../service/CallApi";
import EditTransaction from "./modal/EditTransaction";
import { handleEditingTransaction } from "../../../../function/ApiFunction";
import OpenManualSuccess from "./modal/OpenManualSuccess";
import dayjs from "dayjs";
const PendingTransferTable = ({ pendingTransferRecod, handleGetPendingTransactionRecord, handleGetTransactionRecord }: any) => {
  const { t } = useTranslation();
  const { userInfo } = useContext(Api);
  const [messageApi, contextHolder] = message.useMessage();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openManualSuccess, setOpenManualSuccess] = useState<boolean>(false);
  const [openEditTransaction, setOpenEditTransaction] = useState<boolean>(false);
  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<ITransactionType | undefined>();

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("action"),
      hidden: userInfo?.userType !== 3,
      render: (record: any) => {
        return (
          <Space>
            {record?.mStatus !== "BOT PROCESSING" && record?.mStatus !== "REJECT" && record?.mStatus !== "SUCCESS" && record?.mStatus !== "BOT FAIL" ? (
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
            ) : record?.mStatus !== "REJECT" && record?.mStatus !== "BOT PROCESSING" && record?.mStatus !== "BOT FAIL" ? (
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
              {(record?.isFreeCredit === 1 && record?.mStatus === "WAITING") || (record?.inCredit === 0 && record?.mStatus === "WAITING") ? (
                <>
                  <Tooltip title={t("approve")}>
                    <Button icon={<SendOutlined />} onClick={() => handleInsertTransferTask(record)} disabled={record?.isEditing === 1}></Button>
                  </Tooltip>
                  <Tooltip title={t("manualSuccess")}>
                    <Button icon={<FaHandPaper />} onClick={() => handleOpenManualSuccessModal(record)}></Button>
                  </Tooltip>
                  <Tooltip title={t("reject")}>
                    <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                  </Tooltip>
                </>
              ) : record?.mStatus === "BOT FAIL" ? (
                <>
                  <Tooltip title={t("manualSuccess")}>
                    <Button icon={<FaHandPaper />} onClick={() => handleOpenManualSuccessModal(record)}></Button>
                  </Tooltip>
                  <Tooltip title={t("reject")}>
                    <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                  </Tooltip>
                </>
              ) : record?.mStatus === "HOLD" ? (
                <>
                  <Tooltip title={t("manualSuccess")}>
                    <Button icon={<FaHandPaper />} onClick={() => handleOpenManualSuccessModal(record)}></Button>
                  </Tooltip>
                </>
              ) : record?.mStatus === "BOT PROCESSING" && dayjs().diff(record?.createDate, "hour") > 1 ? (
                <Tooltip title={t("reject")}>
                  <Button icon={<CloseOutlined />} onClick={() => handleRejectTransaction(record)}></Button>
                </Tooltip>
              ) : (
                ""
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
      title: t("out"),
      dataIndex: "outCredit",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
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
            handleGetPendingTransactionRecord("transfer");
            handleGetTransactionRecord("transfer");
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
  function handleOpenManualSuccessModal(values: any) {
    setOpenManualSuccess(true);
    setSelectedPendingDeposit(values);
  }

  function OpenModalEditTransaction(values: any) {
    setSelectedPendingDeposit(values);
    setOpenEditTransaction(true);
    handleEditingTransaction(values, 1);
  }

  function handleInsertTransferTask(values: any) {
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
            console.log("first");
            handleGetPendingTransactionRecord("Transfer");
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
            handleGetPendingTransactionRecord("rekemen");
            handleGetTransactionRecord("rekemen");
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
    samePrev.current = index > 0 ? record.mktSrno === pendingTransferRecod[index - 1]?.mktSrno : true;
    if (index === 0) prevClass.current = "row-highlight-1";
    if (samePrev.current) return prevClass.current;
    else {
      prevClass.current = prevClass.current === "row-highlight-1" ? "row-highlight-2" : "row-highlight-1";
      return prevClass.current;
    }
  };

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
      password: values?.password,
    };
    await mainApi("/insert-transfer-manual-success", object)
      .then(() => {
        handleCloseManualSuccessModal();
        handleGetPendingTransactionRecord("transfer");
        handleGetTransactionRecord("transfer");
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
  return (
    <>
      <Spin spinning={isLoading}>
        {contextHolder}
        <Divider>{t("pendingTransferRecord")}</Divider>

        <Card>
          <Table columns={columns} dataSource={pendingTransferRecod} scroll={{ x: true }} pagination={false} rowClassName={rowClassName} rowHoverable={false} />
        </Card>

        {openEditTransaction && <EditTransaction messageApi={messageApi} selectedPendingDeposit={selectedPendingDeposit} openEditTransaction={openEditTransaction} setOpenEditTransaction={setOpenEditTransaction} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} />}
        {/* manual success */}
        {openManualSuccess && <OpenManualSuccess isLoading={isLoading} setIsLoading={setIsLoading} openManualSuccess={openManualSuccess} handleCloseManualSuccessModal={handleCloseManualSuccessModal} selectedPendingDeposit={selectedPendingDeposit} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleInsertManualSuccess={handleInsertManualSuccess} />}
      </Spin>
    </>
  );
};

export default PendingTransferTable;
