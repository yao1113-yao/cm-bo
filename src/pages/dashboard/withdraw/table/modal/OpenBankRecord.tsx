import { Button, Form, Modal, Select, Space, Table, TableProps, Tooltip } from "antd";
import { formatIndex, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { useState } from "react";
import { ITransactionType } from "../../../../../type/main.interface";
import { BankOutlined } from "@ant-design/icons";
import { mainApi } from "../../../../../service/CallApi";
import { useTranslation } from "react-i18next";

const OpenBankRecord = ({ messageApi, selectedPendingDeposit, actionType, bankRecord, openBankRecord, setOpenBankRecord, handleGetPendingTransactionRecord }: any) => {
  const { t } = useTranslation();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const bankRecordColumns: TableProps<ITransactionType>["columns"] = [
    {
      title: "#",
      hidden: false,
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },
    {
      title: t("bankDate"),
      dataIndex: "bankDate",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankRemark"),
      dataIndex: "bankRemark",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankAmount"),
      dataIndex: "bankAmount",
      hidden: false,
      align: "center",

      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("action"),
      hidden: false,
      render: (record: any) => {
        return (
          <>
            {actionType !== "details" && record.status !== 1 && (
              <Space>
                <Tooltip title={t("assignBank")}>
                  <Button icon={<BankOutlined />} onClick={() => handleAssignBank(record)}>
                    Assign
                  </Button>
                </Tooltip>
              </Space>
            )}
          </>
        );
      },
    },
  ];

  async function handleAssignBank(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      MktDetailsSrno: selectedPendingDeposit?.srno,
      BankRecordSrno: values?.bankRecordSrno,
    };
    await mainApi("/assign-bank", object)
      .then(() => {
        setOpenBankRecord(false);
        handleGetPendingTransactionRecord("deposit");
        messageApi.open({
          type: "success",
          content: "Assign Success",
        });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setIsLoading(false);
  }

  return (
    <>
      <Modal width="70vw" open={openBankRecord} onCancel={() => setOpenBankRecord(false)} footer={null} closable={false} loading={isLoading}>
        <Form>
          <Form.Item label={t("bank")}>
            <Select></Select>
          </Form.Item>
        </Form>

        <Table columns={bankRecordColumns} dataSource={bankRecord}></Table>
      </Modal>
    </>
  );
};

export default OpenBankRecord;
