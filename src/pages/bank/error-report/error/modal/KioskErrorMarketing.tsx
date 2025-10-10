import { Button, Col, DatePicker, Form, Input, Modal, Row, Space, Table, TableProps, Tooltip } from "antd";
import { formatDateTime, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IErrorKioskMarketingRecord } from "../../../../../type/main.interface";
import { BankOutlined } from "@ant-design/icons";
import { LogApi } from "../../../../../service/CallApi";
import CommonButton from "../../../../../components/CommonButton";
import dayjs from "dayjs";
import { Api } from "../../../../../context/ApiContext";

const { RangePicker } = DatePicker;

const KioskErrorMarketing = ({ messageApi, selectedKioskError, openErrorMarketingRecord, setOpenErrorMarketingRecord, handleGetBankErrorReport }: any) => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bankRecord, setBankRecord] = useState<IErrorKioskMarketingRecord[] | undefined>([]);

  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    amount: selectedKioskError?.amount,
    remark: "",
  };

  useEffect(() => {
    handleGetKioskMarketingRecord(initialValues);
  }, []);

  const bankRecordColumns: TableProps<IErrorKioskMarketingRecord>["columns"] = [
    {
      title: t("mktKeyRemark"),
      dataIndex: "remark",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("mktKeyInValue"),
      dataIndex: "inValue",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("customerBank"),
      dataIndex: "customerBank",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankCode"),
      dataIndex: "bankCode",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
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
                <Tooltip title={t("assignMarketingRecord")}>
                  <Button icon={<BankOutlined />} onClick={() => handleAssignMarketingRecord(record)}>
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

  async function handleAssignMarketingRecord(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      kioskErrorSrno: selectedKioskError?.srno,
      mktSrno: values?.srno,
    };

    await LogApi("/assgin-kiosk-error-marketing-record", object)
      .then(() => {
        setOpenErrorMarketingRecord(false);
        handleGetBankErrorReport({ searchDate: [dayjs().subtract(6, "hour"), dayjs()], staffSrno: 0, bank: "all", remark: "" });
        messageApi.open({
          type: "success",
          content: "Assign Success",
        });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "assign kiosk error marketing record error",
        });
      });
    setIsLoading(false);
  }

  async function handleGetKioskMarketingRecord(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      CompanyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      amount: values?.amount,
      remark: values?.remark,
    };
    await LogApi("/kiosk-error-marketing-record", object)
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
    setOpenErrorMarketingRecord(false);
  }

  return (
    <>
      <Modal width="70vw" open={openErrorMarketingRecord} onCancel={() => handleOnCloseModal()} footer={null} closable={false} loading={isLoading}>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetKioskMarketingRecord}>
          <Row gutter={10}>
            <Col xs={6}>
              <Form.Item label={t("searchDate")} name="searchDate">
                <RangePicker style={{ width: "100%" }} showTime />
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

export default KioskErrorMarketing;
