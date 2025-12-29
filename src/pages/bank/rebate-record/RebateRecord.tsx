import CommonButton from "../../../components/CommonButton";
import { useRebateRecord } from "./hook/useRebateRecord";
import { Button, Card, Col, DatePicker, Divider, Form, Row, Spin, Table } from "antd";
import { FileOutlined } from "@ant-design/icons";
import { handleExportExcel } from "../../../function/CommonFunction";
const { RangePicker } = DatePicker;

const RebateRecord = () => {
  const { t, form, isLoading, apiData, userInput, columns, initialValues, handleGetRebateRecord } = useRebateRecord();
  return (
    <>
      <Spin spinning={isLoading}>
        <Card title={t("searchRebateRecord")}>
          <Form layout="vertical" form={form} initialValues={initialValues} onFinish={handleGetRebateRecord}>
            <Row>
              <Col xs={6}>
                <Form.Item label={t("searchDate")} name="searchDate">
                  <RangePicker style={{ width: "100%" }} showTime />
                </Form.Item>
              </Col>
            </Row>

            <CommonButton text="Submit" />

            <Button icon={<FileOutlined />} type="primary" style={{ background: "green", marginLeft: "10px" }} onClick={() => handleExportExcel("Rebate Record", userInput, apiData)}>
              Export Excel
            </Button>
          </Form>
        </Card>

        <Divider />

        <Card title={t("rebateRecord")}>
          <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} rowHoverable={false} />
        </Card>
      </Spin>
    </>
  );
};

export default RebateRecord;
