import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Select, Statistic, Table } from "antd";
import { useTeamSalesReport } from "./hook/useTeamSalesReport";
import CommonButton from "../../../../components/CommonButton";
import { DollarOutlined, FileOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
import { useState } from "react";
import ExpandData from "./ExpandData";
import { handleExportExcel } from "../../../../function/CommonFunction";

const TeamSalesReport = () => {
  const { t, form, companyList, isLoading, userInput, initialValues, columns, apiData, apiData2, handleGetTeamCase } = useTeamSalesReport();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  function handleTableRowExpand(expended: any, record: any) {
    const keys = [];

    if (expended) {
      console.log(record.companyID);
      keys.push(record.companyID);
    }

    setExpandedRowKeys(keys);
  }
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
        <Button icon={<FileOutlined />} type="primary" style={{ background: "green", marginLeft: "10px" }} onClick={() => handleExportExcel("Team Sales Report", userInput, apiData)}>
          {t("Export Excel")}
        </Button>
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
          <Statistic title="Total Deposit" value={apiData2?.totalDeposit} prefix={<DollarOutlined />} valueStyle={{ color: "green" }} />
        </Col>
        <Col xs={3}>
          <Statistic title="Total Withdraw" value={apiData2?.totalWithdraw} prefix={<DollarOutlined />} valueStyle={{ color: "red" }} />
        </Col>
        <Col xs={3}>
          <Statistic title="Total Profit" value={apiData2?.totalProfit} prefix={<DollarOutlined />} valueStyle={{ color: apiData2?.totalProfit ?? 0 < 0 ? "red" : apiData2?.totalProfit ?? 0 > 0 ? "green" : "black" }} />
        </Col>
      </Row>
      <Card loading={isLoading}>
        <Table
          columns={columns}
          dataSource={apiData}
          rowKey="companyID"
          scroll={{ x: true }}
          rowHoverable={false}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: handleTableRowExpand,
            expandedRowRender: (record) => {
              if (record.companyID === expandedRowKeys[0]) {
                return (
                  <div>
                    <ExpandData record={record} userInput={userInput} />
                  </div>
                );
              }
            },
          }}
        />
      </Card>
    </Card>
  );
};

export default TeamSalesReport;
