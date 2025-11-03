import { Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Table } from "antd";
import { useBankRecordHaventAssign } from "./hook/useBankRecordHaventAssign";
import CommonButton from "../../../components/CommonButton";
const { RangePicker } = DatePicker;

const BankRecordHaventAssign = () => {
  const { form, contextHolder, userInfo, companyList, isLoading, initialValues, allBankList, apiData, columns, handleGetBankRecordHaventAssingList } = useBankRecordHaventAssign();
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
          {userInfo && userInfo?.userType > 3 && (
            <Col xs={6}>
              <Form.Item label={"companyID"} name="searchCompanyID">
                <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={"select" + " " + "companyID"} optionFilterProp="label">
                  <Select.Option value="all">All</Select.Option>
                  {companyList?.map((items) => {
                    return <Select.Option value={items.companyID}>{items.companyID}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}
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
        </Row>
        <CommonButton text="Search" />
      </Form>
      <Divider />
      <Table dataSource={apiData} columns={columns} />
    </Card>
  );
};

export default BankRecordHaventAssign;
