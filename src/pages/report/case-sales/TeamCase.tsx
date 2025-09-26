import { Card, Col, DatePicker, Divider, Form, Row, Select, Table } from "antd";
import CommonButton from "../../../components/CommonButton";
import { useTeamCase } from "./hook/useTeamCase";
const { RangePicker } = DatePicker;

const TeamCase = () => {
  const { t, companyList, form, isLoading, initialValues, columns, apiData, handleGetTeamCase } = useTeamCase();
  return (
    <Card>
      <Form layout="vertical" initialValues={initialValues} form={form} onFinish={handleGetTeamCase}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={t("searchDate")} name="searchDate">
              <RangePicker style={{ width: "100%" }} showTime />
            </Form.Item>
          </Col>

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
        </Row>
        <CommonButton text="Submit" />
        &nbsp;
        {/* <Button icon={<LeftCircleOutlined />} type="primary" style={{ background: "blue" }} onClick={() => handleSearchByFilter("day")}>
          {t("today")}
        </Button>
        &nbsp;
        <Button icon={<DownCircleOutlined />} type="primary" style={{ background: "black" }} onClick={() => handleSearchByFilter("yesterday")}>
          {t("yesterday")}
        </Button> */}
      </Form>

      <Divider>Team Case</Divider>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} rowHoverable={false} />
      </Card>
    </Card>
  );
};

export default TeamCase;
