import CommonButton from "../../../components/CommonButton";
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Table } from "antd";
import GameProvider from "../../../components/GameProvider";
import { useTransferRecord } from "./hook/useTransferRecord";

import { DownCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const TransferRecord = () => {
  const { t, form, isLoading, allGameList, apiData, columns, initialValues, handleGetTransferRecordMarketing, rowClassName, handleSearchByFilter } = useTransferRecord();
  return (
    <Card>
      <Form layout="vertical" onFinish={handleGetTransferRecordMarketing} initialValues={initialValues} form={form}>
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
            <Form.Item label={t("gameLoginID")} name="gameLoginID">
              <Input autoComplete="off" />
            </Form.Item>
          </Col>

          <Col xs={6}>
            <GameProvider list={allGameList} required={true} selectAll label="toGameName" />
          </Col>

          <Col xs={6}>
            <Form.Item label={t("toGameLoginID")} name="toGameLoginID">
              <Input autoComplete="off" />
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

      <Divider>Transfer Record</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} rowClassName={rowClassName} rowHoverable={false} />
      </Card>
    </Card>
  );
};

export default TransferRecord;
