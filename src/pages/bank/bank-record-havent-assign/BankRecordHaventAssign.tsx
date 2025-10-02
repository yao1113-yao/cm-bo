import { Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Table } from "antd";
import React from "react";
import { useBankRecordHaventAssign } from "./hook/useBankRecordHaventAssign";
import CommonButton from "../../../components/CommonButton";
const { RangePicker } = DatePicker;

const BankRecordHaventAssign = () => {
  const { t, form, contextHolder, isLoading, initialValues, allBankList, apiData, columns, handleGetBankRecordHaventAssingList } = useBankRecordHaventAssign();
  return (
    <Card loading={isLoading}>
      {contextHolder}
      <Form onFinish={handleGetBankRecordHaventAssingList} form={form} initialValues={initialValues} layout="vertical">
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={"searchDate"} name="searchDate">
              <RangePicker style={{ width: "100%" }} showTime />
            </Form.Item>
          </Col>
          <Col xs={6}>
            {/* <Device list={allBankList} label="bank" selectAll={false} required /> */}
            <Form.Item label="bank" name="bankCode">
              <Select>
                <Select.Option value="all">ALL</Select.Option>
                {allBankList?.map((items) => {
                  return <Select.Option value={items.bankCode}>{items.bankCode}</Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item label="bankRemark" name="bankRemark">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item label="bankAmount" name="bankAmount">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col>
            <CommonButton text="Search" />
          </Col>
        </Row>
      </Form>
      <Table dataSource={apiData} columns={columns} />
    </Card>
  );
};

export default BankRecordHaventAssign;
