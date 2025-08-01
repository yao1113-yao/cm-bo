import { Button, Col, DatePicker, Divider, Form, Row, Spin, Table } from "antd";
import CommonButton from "../../../components/CommonButton";
import { useMaybank } from "./hook/useMaybank";
import Device from "../../../components/Device";
import "./maybank.scss";
const { RangePicker } = DatePicker;

const Maybank = () => {
  const { form, form2, contextHolder, isLoading, initialValues, setBankSelected, selectedCompany, bankRecordColumns, allBankList, bankRecordList, handleInsertBankTransaction, handleGetBankRecordList } = useMaybank();

  return (
    <Spin spinning={isLoading}>
      {contextHolder}
      {/* <Row> */}
      {/* <Col xs={6}>
          <Form>
            <Form.Item label="Company">
              <Select onChange={handleOnChangeSelectedCompany} style={{ width: "100%" }}>
                {companyList?.map((items) => {
                  return (
                    <Select.Option value={items.companyID} key={items.companyID}>
                      {items.companyID}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </Col>
      </Row> */}

      {selectedCompany?.googleSheetUrl ? <iframe src={selectedCompany?.googleSheetUrl} width="100%" height={600} /> : "Please contact admin to open google sheet"}

      <Form layout="vertical" onFinish={handleInsertBankTransaction} form={form}>
        <Row gutter={[20, 10]}>
          {allBankList?.map((items) => {
            return (
              <Col xs={3} key={items.srno}>
                <Form.Item>
                  <Button htmlType="submit" className={`bank-button-${items.item}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected(items.item)}>
                    {items.item}
                  </Button>
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>

      <Divider>Bank Record</Divider>

      <Form onFinish={handleGetBankRecordList} form={form2} initialValues={initialValues}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={"searchDate"} name="searchDate">
              <RangePicker style={{ width: "100%" }} showTime />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Device list={allBankList} label="bank" selectAll={false} required />
          </Col>
          <Col>
            <CommonButton text="Search" />
          </Col>
        </Row>
      </Form>

      <Table dataSource={bankRecordList} columns={bankRecordColumns} pagination={false} />
      {/* </> */}
    </Spin>
  );
};

export default Maybank;
