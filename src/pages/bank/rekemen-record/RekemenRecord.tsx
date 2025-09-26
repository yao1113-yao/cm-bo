import CommonButton from "../../../components/CommonButton";
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Select, Table } from "antd";
import { useRekemenRecord } from "./hook/useRekemenRecord";
import { DownCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const RekemenRecord = () => {
  const { userInfo, companyList, t, form, isLoading, apiData, columns, initialValues, handleGetRekemenRecordMarketing, handleSearchByFilter } = useRekemenRecord();
  return (
    <Card>
      <Form layout="vertical" onFinish={handleGetRekemenRecordMarketing} initialValues={initialValues} form={form}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={t("searchDate")} name="searchDate">
              <RangePicker style={{ width: "100%" }} showTime />
            </Form.Item>
          </Col>

          {userInfo && userInfo?.userType !== 2 && (
            <Col xs={6}>
              <Form.Item label={t("companyID")} name="companyID">
                <Select>
                  <Select.Option value="all">All</Select.Option>
                  {companyList?.map((items) => {
                    return <Select.Option value={items.companyID}>{items.companyID}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}

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

      <Divider>Rekemen Record</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} />
      </Card>
    </Card>
  );
};

export default RekemenRecord;
