import { Card, Col, Divider, Form, InputNumber, Row, Select, Table } from "antd";
import CommonButton from "../../../components/CommonButton";
import { useState } from "react";
import { useTeamBankBalance } from "./hook/useTeamBankBalance";
import ExpandData from "./ExpandData";

const TeamBankBalance = () => {
  const { t, companyList, form, isLoading, initialValues, columns, userInput, apiData, handleGetBankKioskBalance } = useTeamBankBalance();
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
      <Form layout="vertical" initialValues={initialValues} form={form} onFinish={handleGetBankKioskBalance}>
        <Row gutter={20}>
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
          {/* <Col xs={6}>
            <Form.Item label={t("balance")} name="balance">
              <Select>
                <Select.Option value="all">ALL</Select.Option>
                <Select.Option value="<10000">Below 10000</Select.Option>
                <Select.Option value="10000-20000">Below 10000-20000</Select.Option>
                <Select.Option value=">20000">About 20000</Select.Option>
              </Select>
            </Form.Item>
          </Col> */}
          <Col xs={6}>
            <Form.Item label={t("min")} name="min">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={6}>
            <Form.Item label={t("max")} name="max">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <CommonButton text="Submit" />
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

export default TeamBankBalance;
