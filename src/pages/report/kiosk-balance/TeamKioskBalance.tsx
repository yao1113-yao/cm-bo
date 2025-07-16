import { Card, Col, Divider, Form, Input, Row, Select, Table } from "antd";
import CommonButton from "../../../components/CommonButton";
import { useTeamKioskBalance } from "./hook/useTeamKioskBalance";
import { useState } from "react";
import ExpandData from "./ExpandData";

const TeamKioskBalance = () => {
  const { t, form, isLoading, initialValues, columns, userInput, apiData, handleGetTeamKioskBalance } = useTeamKioskBalance();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  function handleTableRowExpand(expended: any, record: any) {
    const keys = [];

    if (expended) {
      keys.push(record.companyID);
    }

    setExpandedRowKeys(keys);
  }
  return (
    <Card>
      <Form layout="vertical" initialValues={initialValues} form={form} onFinish={handleGetTeamKioskBalance}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={t("companyID")} name="companyID">
              <Input value="all" disabled />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item label={t("balance")} name="balance">
              <Select>
                <Select.Option value="all">ALL</Select.Option>
                <Select.Option value="<10000">Below 10000</Select.Option>
                <Select.Option value="10000-20000">Below 10000-20000</Select.Option>
                <Select.Option value=">20000">About 20000</Select.Option>
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

      <Divider>Team Kiosk Balance</Divider>

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

export default TeamKioskBalance;
