import { Card, Col, Divider, Form, Input, InputNumber, Row, Select, Table } from "antd";
import CommonButton from "../../../../components/CommonButton";
import Staff from "../../../../components/Staff";
import { useBankErrorReport } from "./hook/useBankErrorReport";
import Device from "../../../../components/Device";

const BankErrorReport = () => {
  const { t, isLoading, isKioskReportLoading, contextHolder, form, allBankList, allStaffList, apiData, initialValues, columns, handleInsertBankError, handleGetBankErrorReport } = useBankErrorReport();

  return (
    <div>
      {contextHolder}
      <Card title={t("addBankAdjustment")} loading={isLoading}>
        <Form layout="vertical" form={form} onFinish={handleInsertBankError}>
          <Row gutter={20}>
            <Col xs={6}>
              <Form.Item label={t("type")} name="type" rules={[{ required: true }]}>
                <Select defaultActiveFirstOption={true} filterOption={(inputValue: any, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("type")} optionFilterProp="label">
                  <Select.Option value="Payment">Payment</Select.Option>
                  <Select.Option value="Error">Error</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Device list={allBankList} label="bank" selectAll={false} required />
            </Col>

            <Col xs={6}>
              <Staff list={allStaffList} selectAll={false} label="staffSrno" required={false} />
            </Col>
            <Col xs={6}>
              <Form.Item label={t("point")} name="point" required>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("remark")} name="remark" required>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ fontWeight: "500", color: "red" }}>
            *Reminder: &nbsp;<span style={{ fontSize: "18px", color: "green" }}>Positve</span> is add point to kiosk , <span style={{ fontSize: "18px", color: "green" }}> Negative</span> is deduct point to Bank
          </div>

          <CommonButton text="Add" />
        </Form>
      </Card>
      <Divider> Bank Adjustment Report</Divider>
      <Card loading={isKioskReportLoading}>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetBankErrorReport}>
          <Row gutter={20}>
            <Col xs={6}>
              <Device list={allBankList} label="bank" selectAll={true} required />
            </Col>

            <Col xs={6}>
              <Staff list={allStaffList} required={true} selectAll={true} label="staffSrno" />
            </Col>

            <Col xs={6}>
              <Form.Item label={t("remark")} name="remark" required>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <CommonButton text="Search" />
        </Form>

        <Divider />

        <Table columns={columns} dataSource={apiData} rowClassName={(_record, index) => (index % 2 === 0 ? "row-highlight-1" : "row-highlight-2")} rowHoverable={false}></Table>
      </Card>
    </div>
  );
};

export default BankErrorReport;
