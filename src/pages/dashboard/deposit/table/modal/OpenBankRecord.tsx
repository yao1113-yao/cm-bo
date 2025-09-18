import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Space, Table, TableProps, Tooltip } from "antd";
import { formatDateTime, formatIndex, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ITransactionType } from "../../../../../type/main.interface";
import { BankOutlined } from "@ant-design/icons";
import { mainApi } from "../../../../../service/CallApi";
import CommonButton from "../../../../../components/CommonButton";
import dayjs from "dayjs";
import { Api } from "../../../../../context/ApiContext";

const { RangePicker } = DatePicker;

const OpenBankRecord = ({ messageApi, isCheckAllAmount, setIsCheckAllAmount, selectedPendingDeposit, openBankRecord, setOpenBankRecord, handleGetPendingTransactionRecord }: any) => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bankRecord, setBankRecord] = useState<ITransactionType[] | undefined>([]);

  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    mBank: selectedPendingDeposit?.mBank,
    amount: selectedPendingDeposit?.bankOut,
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
    // const formData = new FormData();
    // formData.append("userID", userID as string);
    // formData.append("userToken", userToken as string);
    // formData.append("mktDetailsSrno", selectedPendingDeposit?.srno);
    // formData.append("bankRecordSrno", values?.bankRecordSrno);
    const object = {
      userID: userID,
      userToken: userToken,
      companyID: subdomain,
      mktDetailsSrno: selectedPendingDeposit?.srno,
      bankRecordSrno: values?.bankRecordSrno,
    };
    await mainApi("/assign-bank", object)
      .then(() => {
        setOpenBankRecord(false);
        setIsCheckAllAmount(false);
        handleGetPendingTransactionRecord("deposit");
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

  function handleCheckFreeCredit() {
    setIsCheckAllAmount(!isCheckAllAmount);
  }

  async function handleGetBankRecord(values: any) {
    console.log(isCheckAllAmount);
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      Type: "Deposit",
      Bank: values?.mBank,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      Amount: isCheckAllAmount === true ? -1 : values?.amount,
      CompanyID: subdomain,
    };
    await mainApi("/bank-record", object)
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
    setIsCheckAllAmount(false);
  }

  return (
    <>
      <Modal width="70vw" open={openBankRecord} onCancel={() => handleOnCloseModal()} footer={null} closable={false} loading={isLoading}>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetBankRecord}>
          <Row gutter={10}>
            <Col xs={6}>
              <Form.Item label={t("searchDate")} name="searchDate">
                <RangePicker style={{ width: "100%" }} showTime />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("bank")} name="mBank">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item
                label={
                  <Space>
                    {t("amount")}
                    <Checkbox onChange={handleCheckFreeCredit} checked={isCheckAllAmount}>
                      <div>&nbsp;All Amount</div>
                    </Checkbox>
                  </Space>
                }
                name="amount"
              >
                <Input disabled={isCheckAllAmount} />
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
