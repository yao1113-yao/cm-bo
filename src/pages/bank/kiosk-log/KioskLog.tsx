import CommonButton from "../../../components/CommonButton";
import { Button, Card, Col, DatePicker, Divider, Form, Row, Select, Table } from "antd";
import { DownCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";
import { useKioskLog } from "./hook/useKioskLog";
import GameProvider from "../../../components/GameProvider";

const { RangePicker } = DatePicker;
const KioskLog = () => {
  const { t, form, contextHolder, isLoading, apiData, columns, allGameList, initialValues, handleGetMatchBankLaterList, handleSearchByFilter } = useKioskLog();
  return (
    <Card>
      {contextHolder}
      <Form layout="vertical" onFinish={handleGetMatchBankLaterList} initialValues={initialValues} form={form}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={t("searchDate")} name="searchDate">
              <RangePicker style={{ width: "100%" }} showTime />
            </Form.Item>
          </Col>

          <Col xs={6}>
            <GameProvider list={allGameList} required={true} selectAll label="gameName" />
          </Col>

          <Col xs={6}>
            <Form.Item label={t("remark")} name="remark">
              <Select>
                <Select.Option value="all">all</Select.Option>
                <Select.Option value="Customer Deposit">Customer Deposit</Select.Option>
                <Select.Option value="Customer Withdraw">Customer Withdraw</Select.Option>
                <Select.Option value="Transfer Deposit">Transfer Deposit</Select.Option>
                <Select.Option value="Transfer Withdraw">Transfer Withdraw</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <CommonButton text="Submit" />
        &nbsp;
        <Button icon={<LeftCircleOutlined />} type="primary" style={{ background: "blue" }} onClick={() => handleSearchByFilter("day")}>
          {t("today")}
        </Button>
        &nbsp;
        <Button icon={<DownCircleOutlined />} type="primary" style={{ background: "black" }} onClick={() => handleSearchByFilter("yesterday")}>
          {t("yesterday")}
        </Button>
      </Form>

      <Divider>Transaction Kiosk</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} />
      </Card>
    </Card>
  );
};

export default KioskLog;
