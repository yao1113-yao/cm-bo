import CommonButton from "../../../components/CommonButton";
import { Button, Card, Col, DatePicker, Divider, Form, message, Row, Select, Table, TableProps, Tooltip } from "antd";
import { bankApi } from "../../../service/CallApi";
import { useTranslation } from "react-i18next";
import { Api } from "../../../context/ApiContext";
import { useContext, useEffect, useState } from "react";
import { IKioskLogType } from "../../../type/main.interface";
import dayjs from "dayjs";
import { formatDateTime, formatNumber, formatString } from "../../../function/CommonFunction";
import { AccountBookOutlined } from "@ant-design/icons";
import CheckTransaction from "./modal/CheckTransaction";

const { RangePicker } = DatePicker;
const ExpandData = ({ record }: any) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { subdomain } = useContext(Api);
  const [messageApi, contextHolder] = message.useMessage();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModalCheckTransaction, setOpenModalCheckTransaction] = useState<boolean>(false);
  const [recordCheckTransaction, setRecordCheckTransaction] = useState<IKioskLogType | undefined>();
  const [apiData, setApiData] = useState<IKioskLogType[]>([]);
  //   const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    gameName: "all",
    remark: "all",
  };
  useEffect(() => {
    // getAllItemCodeList("MBank", setIsLoading, setAllBankList);
    // getAllGameProviderList(setIsLoading, setAllGameList);
    handleGetKioskLog(initialValues);
  }, []);

  const columns: TableProps<IKioskLogType>["columns"] = [
    {
      title: t("createDate"),
      dataIndex: "createDate",
      align: "center",
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("companyID"),
      dataIndex: "companyID",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("gameName"),
      dataIndex: "gameName",
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
      title: t("beforeBalance"),
      dataIndex: "beforeBalance",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },

    {
      title: t("afterBalance"),
      dataIndex: "afterBalance",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("action"),
      ellipsis: true,
      render: (record) => {
        return (
          <>
            <Tooltip title={t("checkTransaction")}>
              <Button icon={<AccountBookOutlined />} onClick={() => handleOpenModalCheckTransaction(record)}></Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  async function handleGetKioskLog(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      gameName: record?.gameName,
      remark: values?.remark,
    };
    await bankApi("/kiosk-log", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error?.response?.data?.message,
        });
      });
    setIsLoading(false);
  }

  function handleOpenModalCheckTransaction(value: any) {
    setOpenModalCheckTransaction(!openModalCheckTransaction);
    setRecordCheckTransaction(value);
  }

  return (
    <Card>
      {contextHolder}
      <Form layout="vertical" onFinish={handleGetKioskLog} initialValues={initialValues} form={form}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={t("searchDate")} name="searchDate">
              <RangePicker style={{ width: "100%" }} showTime />
            </Form.Item>
          </Col>

          {/* <Col xs={6}>
            <GameProvider list={allGameList} required={true} selectAll label="gameName" />
          </Col> */}

          <Col xs={6}>
            <Form.Item label={t("remark")} name="remark">
              <Select>
                <Select.Option value="all">all</Select.Option>
                <Select.Option value="Customer Deposit">Customer Deposit</Select.Option>
                <Select.Option value="Customer Withdraw">Customer Withdraw</Select.Option>
                <Select.Option value="Transfer Deposit">Transfer Deposit</Select.Option>
                <Select.Option value="Transfer Withdraw">Transfer Withdraw</Select.Option>
                <Select.Option value="Take Out Bank">Take Out Bank</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <CommonButton text="Submit" />
        {/* &nbsp;
        <Button icon={<LeftCircleOutlined />} type="primary" style={{ background: "blue" }} onClick={() => handleSearchByFilter("day")}>
          {t("today")}
        </Button>
        &nbsp;
        <Button icon={<DownCircleOutlined />} type="primary" style={{ background: "black" }} onClick={() => handleSearchByFilter("yesterday")}>
          {t("yesterday")}
        </Button> */}
      </Form>

      <Divider>Transaction Kiosk</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} />
      </Card>

      {openModalCheckTransaction && <CheckTransaction openModalCheckTransaction={openModalCheckTransaction} setOpenModalCheckTransaction={setOpenModalCheckTransaction} recordCheckTransaction={recordCheckTransaction} />}
    </Card>
  );
};

export default ExpandData;
