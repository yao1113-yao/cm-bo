import CommonButton from "../../../components/CommonButton";
import Device from "../../../components/Device";
import { useBankRecord } from "./hook/useBankRecord";
import { Card, Col, DatePicker, Divider, Form, Input, Row, Table } from "antd";

const { RangePicker } = DatePicker;
const BankRecord = () => {
  const { t, isLoading, allBankList, apiData, columns, initialValues, handleGetBankRecordMarketingList } = useBankRecord();
  return (
    <Card>
      <Form layout="vertical" onFinish={handleGetBankRecordMarketingList} initialValues={initialValues}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={t("searchDate")} name="searchDate">
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={6}>
            <Device list={allBankList} label="bank" selectAll={false} required />
          </Col>

          <Col xs={6}>
            <Form.Item label={t("remark")} name="remark">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <CommonButton text="Submit" />
      </Form>

      <Divider>Bank Record</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} />
      </Card>
    </Card>
  );
};

export default BankRecord;
