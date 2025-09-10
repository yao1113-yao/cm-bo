import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Space, Table, TableProps, Tooltip } from "antd";
import { formatDateTime, formatIndex, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ITransactionType } from "../../../../../type/main.interface";
import { BankOutlined } from "@ant-design/icons";
import { LogApi, mainApi } from "../../../../../service/CallApi";
import CommonButton from "../../../../../components/CommonButton";
import dayjs from "dayjs";
import { Api } from "../../../../../context/ApiContext";

const { RangePicker } = DatePicker;

const OpenBankRecord = ({ messageApi, selectedPendingDeposit, openBankRecord, setOpenBankRecord, handleGetBankErrorReport }: any) => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bankRecord, setBankRecord] = useState<ITransactionType[] | undefined>([]);

  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    bankCode: selectedPendingDeposit?.bankCode,
    amount: selectedPendingDeposit?.amount,
  };

  useEffect(() => {
    handleGetBankRecord(initialValues);
    console.log("first");
  }, []);

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
      title: t("createDate"),
      dataIndex: "createDate",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("action"),
      hidden: false,
      render: (record: any) => {
        return (
          <>
            {record.status !== 1 && (
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
      bankAdjustmentSrno: selectedPendingDeposit?.srno,
      bankRecordSrno: values?.bankRecordSrno,
    };

    await LogApi("/assign-bank-adjustment", object)
      .then(() => {
        setOpenBankRecord(false);
        handleGetBankErrorReport({ searchDate: [dayjs().subtract(6, "hour"), dayjs()], staffSrno: 0, bank: "all", remark: "" });
        messageApi.open({
          type: "success",
          content: "Assign Success",
        });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "assign bank error",
        });
      });
    setIsLoading(false);
  }

  async function handleGetBankRecord(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      Bank: values?.bankCode,
      CompanyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      amount: values?.amount,
    };
    await LogApi("/bank-record", object)
      .then((result: any) => {
        setBankRecord(result.data);
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "get bank record error",
        });
      });
    setIsLoading(false);
  }

  function handleOnCloseModal() {
    setOpenBankRecord(false);
  }

  return (
    <>
      <Modal width="70vw" open={openBankRecord} onCancel={() => handleOnCloseModal()} footer={null} closable={false} loading={isLoading}>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetBankErrorReport}>
          <Row gutter={10}>
            <Col xs={6}>
              <Form.Item label={t("searchDate")} name="searchDate">
                <RangePicker style={{ width: "100%" }} showTime />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("bank")} name="bankCode">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("amount")} name="amount">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item label=" ">
                <CommonButton text="search" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table columns={bankRecordColumns} dataSource={bankRecord}></Table>
      </Modal>
    </>
  );
};

export default OpenBankRecord;
