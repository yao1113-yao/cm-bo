import { Card, Col, Divider, Form, Input, InputNumber, Row, Select, Table } from "antd";
import { useKioskErrorReport } from "./hook/useKioskErrorReport";
import GameProvider from "../../../../components/GameProvider";
import CommonButton from "../../../../components/CommonButton";
import Staff from "../../../../components/Staff";

const KioskErrorReport = () => {
  const { t, isLoading, isKioskReportLoading, contextHolder, form, allGameList, allStaffList, apiData, initialValues, columns, handleInsertKioskError, handleGetKioskErrorReport } = useKioskErrorReport();

  return (
    <div>
      {contextHolder}
      <Card title={t("addKioskAdjustment")} loading={isLoading}>
        <Form layout="vertical" form={form} onFinish={handleInsertKioskError}>
          <Row gutter={20}>
            <Col xs={6}>
              <Form.Item label={t("type")} name="type" rules={[{ required: true }]}>
                <Select defaultActiveFirstOption={true} filterOption={(inputValue: any, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("type")} optionFilterProp="label">
                  <Select.Option value="Edit Point">Edit Point</Select.Option>
                  <Select.Option value="Error">Error</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={6}>
              <GameProvider list={allGameList} required={true} selectAll={false} label="gameName" />
            </Col>

            <Col xs={6}>
              <Staff list={allStaffList} required={false} selectAll={false} label="staffSrno" />
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
            *Reminder: &nbsp;<span style={{ fontSize: "18px", color: "green" }}>Positve</span> is add point to kiosk , <span style={{ fontSize: "18px", color: "green" }}> Negative</span> is deduct point to kiosk
          </div>

          <CommonButton text="Add" />
        </Form>
      </Card>
      <Divider>Kiosk Adjustment Report</Divider>
      <Card loading={isKioskReportLoading}>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetKioskErrorReport}>
          <Row gutter={20}>
            <Col xs={6}>
              <GameProvider list={allGameList} required={true} selectAll={true} label="gameName" />
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

        <Table columns={columns} dataSource={apiData}></Table>
      </Card>
    </div>
  );
};

export default KioskErrorReport;
