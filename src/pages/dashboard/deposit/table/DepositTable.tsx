import { Button, Card, Divider, message, Space, Table, TableProps, Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { ITransactionType } from "../../../../type/main.interface";
import { formatDateTime, formatNumber, formatString } from "../../../../function/CommonFunction";
import { useContext, useRef, useState } from "react";

import { CheckOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { mainApi } from "../../../../service/CallApi";
import { Api } from "../../../../context/ApiContext";

const DepositTable = ({ depositRecord, handleGetPendingTransactionRecord, handleGetTransactionRecord }: any) => {
  const { t } = useTranslation();
  const { userInfo } = useContext(Api);

  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: "action",
      align: "center",
      render: (record) => {
        return (
          <Space>
            {userInfo?.userType === 3 && record?.mStatus === "SUCCESS" ? (
              <Tooltip title={t("Noted")}>
                <Button onClick={() => handleNotedTransaction(record)}>
                  <CheckOutlined />
                </Button>
              </Tooltip>
            ) : (
              ""
            )}
          </Space>
        );
      },
    },
    {
      title: t("status"),
      dataIndex: "mStatus",
      align: "center",
      render: (text: string, record) => {
        return record?.isManual === 1 && text === "SUCCESS" ? <Tag color="#13c2c2">MANUAL SUCCESS</Tag> : <Tag color={text === "WAITING" ? "#2db7f5" : text === "HOLD" ? "#ad8b00" : text === "DONE" ? "#87d068" : text === "REJECT" ? "#f50" : text === "TOP UP" ? "#36cfc9" : ""}>{text}</Tag>;
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
        if (index > 0 && record.mktSrno === depositRecord[index - 1]?.mktSrno) return <div>-</div>;
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("bank"),
      dataIndex: "mBank",

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
      title: t("freeCredit"),
      dataIndex: "freeCredit",
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

  const samePrev = useRef<boolean>(false);
  const prevClass = useRef<string>("row-highlight-1");

  const rowClassName = (record: any, index: number) => {
    samePrev.current = index > 0 ? record.mktSrno === depositRecord[index - 1]?.mktSrno : true;
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
      <Divider>{t("depositRecord")}</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={depositRecord} scroll={{ x: true }} pagination={false} rowClassName={rowClassName} rowHoverable={false} />
      </Card>
    </>
  );
};

export default DepositTable;
