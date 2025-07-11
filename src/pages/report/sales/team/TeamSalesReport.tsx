import { Card, Col, DatePicker, Divider, Form, Input, Row, Space, Statistic, StatisticProps, Table } from "antd";
import { useTeamSalesReport } from "./hook/useTeamSalesReport";
import CommonButton from "../../../../components/CommonButton";
import { DollarOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
import CountUp from "react-countup";

const formatter: StatisticProps["formatter"] = (value) => <CountUp end={value as number} separator="," />;
const TeamSalesReport = () => {
  const { t, form, isLoading, initialValues, columns, apiData, apiData2, handleGetTeamCase } = useTeamSalesReport();

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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item label={t("staffCode")} name="staffCode">
              <Input disabled />
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
      <Row style={{ paddingBottom: "20px" }}>
        <Col xs={3}>
          <Statistic title="Total Deposit" value={apiData2?.totalDeposit} formatter={formatter} prefix={<DollarOutlined />} valueStyle={{ color: "green" }} />
        </Col>
        <Col xs={3}>
          <Statistic title="Total Withdraw" value={apiData2?.totalWithdraw} formatter={formatter} prefix={<DollarOutlined />} valueStyle={{ color: "red" }} />
        </Col>
      </Row>
      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} rowHoverable={false} />
      </Card>
    </Card>
  );
};

export default TeamSalesReport;
