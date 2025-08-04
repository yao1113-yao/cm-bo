import { message, Modal, Spin, Table, TableProps, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { LogApi } from "../../../../service/CallApi";
import { useContext, useEffect, useState } from "react";
import { Api } from "../../../../context/ApiContext";
import { ITransactionType } from "../../../../type/main.interface";
import { formatDateTime, formatNumber, formatString } from "../../../../function/CommonFunction";

const CheckTransaction = ({ openModalCheckTransaction, setOpenModalCheckTransaction, recordCheckTransaction }: any) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITransactionType[]>([]);

  console.log(recordCheckTransaction);

  useEffect(() => {
    handleCheckTransaction(recordCheckTransaction);
  }, []);

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("status"),
      dataIndex: "mStatus",
      align: "center",
      render: (text: string, record) => {
        return record?.isSeen === 1 && text === "SUCCESS" ? <Tag color="#87d068">DONE</Tag> : record?.isSeen === 1 && text === "REJECT" ? <Tag color="#f50">REJECT NOTED</Tag> : record?.isSeen === 0 && text === "REJECT" ? <Tag color="#f50">REJECT </Tag> : text === "HOLD" ? <Tag color="">HOLD</Tag> : text === "SUCCESS" && record?.isSeen === 0 ? <Tag color="#87d068">SUCCESS</Tag> : "";
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
      title: t("recordType"),
      dataIndex: "recordType",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{text === "Main" ? "DEPOSIT" : formatString(text)}</div>;
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
      render: (text: number) => {
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
      title: t("bonus"),
      dataIndex: "bonus",
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

  async function handleCheckTransaction(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: subdomain,
      mktDetailsSrno: values?.mktDetailsSrno,
    };
    await LogApi("/kiosk-check-transaction", object)
      .then((result) => {
        setApiData(result.data);
      })
      .catch(() => {
        console.log("first");
        messageApi.open({
          type: "error",
          content: "api error",
        });
      });
    setIsLoading(false);
  }
  return (
    <>
      {contextHolder}
      <Spin spinning={isLoading}>
        <Modal width="80vw" open={openModalCheckTransaction} onCancel={() => setOpenModalCheckTransaction(!openModalCheckTransaction)} footer={null} closable={false} title={t("checkTransaction")}>
          <Table columns={columns} dataSource={apiData} scroll={{ x: true }} pagination={false} />
        </Modal>
      </Spin>
    </>
  );
};

export default CheckTransaction;
