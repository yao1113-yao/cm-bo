import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, TableProps, Tooltip, Upload } from "antd";
import { formatIndex, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { useContext, useEffect, useState } from "react";
import { IDeviceType, ITransactionType } from "../../../../../type/main.interface";
import { BankOutlined } from "@ant-design/icons";
import { mainApi } from "../../../../../service/CallApi";
import { useTranslation } from "react-i18next";
import { getAllItemCodeList } from "../../../../../function/ApiFunction";
import { checkMedia, normFile } from "../../../../../function/antd-upload/Upload";

import { CloudUploadOutlined } from "@ant-design/icons";
import { Api } from "../../../../../context/ApiContext";

const OpenBankRecord = ({ messageApi, selectedPendingDeposit, openBankRecord, setOpenBankRecord, handleGetPendingTransactionRecord, handleGetTransactionRecord, isLater, isManual }: any) => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);
  console.log(isLater);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeviceLoading, setIsDeviceLoading] = useState<boolean>(false);
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();
  const [bankRecord, setBankRecord] = useState<ITransactionType[] | undefined>([]);

  const initialValues = { bank: selectedPendingDeposit?.MBank, amount: selectedPendingDeposit?.bankOut };
  console.log(isLoading, isDeviceLoading);
  useEffect(() => {
    getAllItemCodeList("MBank", setIsDeviceLoading, setAllBankList);
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
    const temp = form.getFieldValue("imageUrl") ?? [];
    setIsLoading(true);
    const formData = new FormData();
    formData.append("userID", userID as string);
    formData.append("userToken", userToken as string);
    formData.append("mktDetailsSrno", selectedPendingDeposit?.srno);
    formData.append("bankRecordSrno", values?.bankRecordSrno);
    formData.append("receiptImage", temp[0]?.originFileObj);
    formData.append("isManual", isManual);
    formData.append("isLater", isLater);
    await mainApi("/assign-withdraw-bank", formData)
      .then(() => {
        setOpenBankRecord(false);
        setBankRecord([]);
        handleGetPendingTransactionRecord("withdraw");
        handleGetTransactionRecord("withdraw");
        messageApi.open({
          type: "success",
          content: "Assign Success",
        });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "error",
        });
      });
    setIsLoading(false);
  }

  async function handleGetBankRecord(e: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      CompanyID: subdomain,
      Type: "Withdraw",
      Bank: e,
      amount: selectedPendingDeposit?.bankOut,
    };
    await mainApi("/bank-record", object)
      .then((result: any) => {
        setOpenBankRecord(true);
        setBankRecord(result.data);
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "bank record not found",
        });
      });
    setIsLoading(false);
  }

  function OnCancel() {
    setOpenBankRecord(false);
    setBankRecord([]);
  }

  return (
    <>
      <Modal width="70vw" open={openBankRecord} onCancel={() => OnCancel()} footer={null} closable={false} destroyOnClose>
        <Form initialValues={initialValues}>
          <Row gutter={20}>
            <Col xs={6}>
              <Form.Item label="bank" name="bank">
                <Select onChange={handleGetBankRecord} defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("bank")} optionFilterProp="label">
                  {allBankList?.map((items: any) => (
                    <Select.Option value={items.item} key={items.item}>
                      {items?.item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item label="amount" name="amount">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Table columns={bankRecordColumns} dataSource={bankRecord}></Table>

        <Form form={form}>
          <Form.Item label={t("receipt")} name="imageUrl" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: t("pleaseUploadReceipt") }]}>
            <Upload maxCount={1} listType="picture" beforeUpload={checkMedia}>
              <Button icon={<CloudUploadOutlined />}>{t("clickToUpload")}</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OpenBankRecord;
