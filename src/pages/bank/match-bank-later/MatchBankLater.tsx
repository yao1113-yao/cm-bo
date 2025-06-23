import CommonButton from "../../../components/CommonButton";
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Table } from "antd";
import { DownCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";
import { useMatchBankLater } from "./hook/useMatchBankLater";
import OpenBankRecord from "./modal/OpenBankRecord";

const { RangePicker } = DatePicker;
const MatchBankLater = () => {
  const { t, form, messageApi, contextHolder, isLoading, apiData, columns, initialValues, openBankRecord, setOpenBankRecord, selectedPendingDeposit, isCheckAllAmount, setIsCheckAllAmount, handleGetMatchBankLaterList, handleSearchByFilter, rowClassName } = useMatchBankLater();
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
            <Form.Item label={t("remark")} name="remark">
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

      <Divider>Match Bank Later Record List</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} rowClassName={rowClassName} rowHoverable={false} />
      </Card>

      {/* open bank list assign bank */}
      {openBankRecord && <OpenBankRecord messageApi={messageApi} initialValues={initialValues} isCheckAllAmount={isCheckAllAmount} setIsCheckAllAmount={setIsCheckAllAmount} selectedPendingDeposit={selectedPendingDeposit} openBankRecord={openBankRecord} setOpenBankRecord={setOpenBankRecord} handleGetMatchBankLaterList={handleGetMatchBankLaterList} />}
    </Card>
  );
};

export default MatchBankLater;
