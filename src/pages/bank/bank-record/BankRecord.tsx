import CommonButton from "../../../components/CommonButton";
import { useBankRecord } from "./hook/useBankRecord";
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Select, Table } from "antd";
import { DownCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const BankRecord = () => {
  const { t, userInfo, form, contextHolder, isLoading, apiData, columns, initialValues, handleGetBankRecordMarketingList, handleSearchByFilter, rowClassName } = useBankRecord();
  return (
    <Card>
      {contextHolder}
      <Form layout="vertical" onFinish={handleGetBankRecordMarketingList} initialValues={initialValues} form={form}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={t("searchDate")} name="searchDate">
              <RangePicker style={{ width: "100%" }} showTime />
            </Form.Item>
          </Col>
          {userInfo && userInfo?.userType !== 2 && (
            <Col xs={6}>
              <Form.Item label={t("companyID")} name="companyID">
                <Input disabled />
              </Form.Item>
            </Col>
          )}

          <Col xs={6}>
            <Form.Item label={t("type")} name="type">
              <Select>
                <Select.Option value="all">ALL</Select.Option>
                <Select.Option value="MAIN">DEPOSIT</Select.Option>
                <Select.Option value="WITHDRAW">WITHDRAW</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* <Col xs={6}>
            <Device list={allBankList} label="bank" selectAll required />
          </Col> */}

          {/* <Col xs={6}>
            <Form.Item label={t("remark")} name="remark">
              <Input />
            </Form.Item>
          </Col> */}
          <Col xs={6}>
            <Form.Item label={t("keyword")} name="keyword">
              <Input />
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

      <Divider>Bank Record</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} rowClassName={rowClassName} rowHoverable={false} />
      </Card>
    </Card>
  );
};

export default BankRecord;
