import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table, TableProps, Tooltip } from "antd";
import { formatIndex, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { useContext, useEffect, useState } from "react";
import { IDeviceType, ITransactionType } from "../../../../../type/main.interface";
import { BankOutlined, SendOutlined } from "@ant-design/icons";
import { mainApi } from "../../../../../service/CallApi";
import { useTranslation } from "react-i18next";
import { getAllItemCodeList } from "../../../../../function/ApiFunction";

import { Api } from "../../../../../context/ApiContext";
import dayjs from "dayjs";
import { TableRowSelection } from "antd/es/table/interface";

const { RangePicker } = DatePicker;

const OpenBankRecord = ({ messageApi, selectedPendingDeposit, openBankRecord, setOpenBankRecord, handleGetPendingTransactionRecord, handleGetTransactionRecord, isLater, isManual }: any) => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);
  console.log(isLater);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeviceLoading, setIsDeviceLoading] = useState<boolean>(false);
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();
  const [bankRecord, setBankRecord] = useState<ITransactionType[] | undefined>([]);
  const [withdrawSplit, setWithdrawSplit] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ITransactionType[] | undefined>([]);

  const initialValues = { searchDate: [dayjs().subtract(6, "hour"), dayjs()], bank: "all", amount: selectedPendingDeposit?.bankOut };
  console.log(isLoading, isDeviceLoading);
  useEffect(() => {
    getAllItemCodeList("MBank", setIsDeviceLoading, setAllBankList);
    handleGetBankRecord(initialValues);
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
      hidden: withdrawSplit,
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
  async function handleAssignWithdrawSplitBank() {
    let sum = 0;
    selectedRow?.forEach((selected) => {
      sum += selected?.bankAmount;
    });

    console.log(sum);
    if (selectedPendingDeposit?.bankOut === sum) {
      setIsLoading(true);
      const object = {
        userID: userID,
        userToken: userToken,
        UserType: userType,
        companyID: subdomain,
        mktDetailsSrno: selectedPendingDeposit?.srno,
        ListAssignBank: selectedRow,
        isManual: isManual,
        isLater: isLater,
      };
      await mainApi("/assign-split-withdraw-bank", object)
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
    } else {
      messageApi.open({
        type: "warning",
        content: "amount not equals to bank out amount",
      });
    }
    // setIsLoading(false);
  }

  async function handleAssignBank(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      mktDetailsSrno: selectedPendingDeposit?.srno,
      bankRecordSrno: values?.bankRecordSrno,
      isManual: isManual,
      isLater: isLater,
    };
    await mainApi("/assign-withdraw-bank", object)
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

  async function handleGetBankRecord(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      CompanyID: subdomain,
      Type: "Withdraw",
      Bank: withdrawSplit ? "all" : values?.bank,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      amount: withdrawSplit ? -1 : selectedPendingDeposit?.bankOut,
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
    setWithdrawSplit(false);
  }
  function handleOnChageCheckBox() {
    setSelectedRow([]);
    setWithdrawSplit(!withdrawSplit);
  }

  // Define rowSelection type
  const rowSelection: TableRowSelection<ITransactionType> | undefined = withdrawSplit
    ? {
        onChange: (_newSelectedRowKeys: React.Key[], selectedRows: ITransactionType[]) => {
          // console.log("Selected Keys:", newSelectedRowKeys);
          console.log("Selected Rows:", selectedRows);
          setSelectedRow(selectedRows);
        },
      }
    : undefined; // hide checkbox if false

  return (
    <>
      <Modal width="70vw" open={openBankRecord} onCancel={() => OnCancel()} footer={null} closable={false} destroyOnClose>
        <Checkbox checked={withdrawSplit} onChange={handleOnChageCheckBox}>
          Withdraw Split
        </Checkbox>

        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetBankRecord}>
          <Row gutter={20}>
            <Col xs={6}>
              <Form.Item label={t("searchDate")} name="searchDate">
                <RangePicker style={{ width: "100%" }} showTime />
              </Form.Item>
            </Col>

            {!withdrawSplit && (
              <>
                <Col xs={6}>
                  <Form.Item label="amount" name="amount">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={6}>
                  <Form.Item label="bank" name="bank">
                    <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("bank")} optionFilterProp="label">
                      <Select.Option value="all">All</Select.Option>
                      {allBankList?.map((items: any) => (
                        <Select.Option value={items.item} key={items.item}>
                          {items?.item}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </>
            )}

            {/* {withdrawSplit && ( */}
            <Form.Item label=" ">
              <Button type="primary" icon={<SendOutlined />} htmlType="submit">
                Search
              </Button>
            </Form.Item>
            {/* )} */}
          </Row>
        </Form>

        <Table columns={bankRecordColumns} dataSource={bankRecord} rowSelection={rowSelection} rowKey="bankRecordSrno"></Table>

        {withdrawSplit && (
          <Button type="primary" icon={<SendOutlined />} onClick={() => handleAssignWithdrawSplitBank()}>
            Submit
          </Button>
        )}

        {/* <Form form={form} style={{ paddingTop: "10px" }}>
          <Form.Item label={t("receipt")} name="imageUrl" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: t("pleaseUploadReceipt") }]}>
            <Upload maxCount={1} listType="picture" beforeUpload={checkMedia}>
              <Button icon={<CloudUploadOutlined />}>{t("clickToUpload")}</Button>
            </Upload>
          </Form.Item>
        </Form> */}
      </Modal>
    </>
  );
};

export default OpenBankRecord;
