import { Button, Col, Divider, Form, Row, Spin, Table } from "antd";
import CommonButton from "../../../components/CommonButton";
import { useMaybank } from "./hook/useMaybank";
import Device from "../../../components/Device";
import "./maybank.scss";
const Maybank = () => {
  const { form, form2, contextHolder, isLoading, setBankSelected, selectedCompany, bankRecordColumns, allBankList, bankRecordList, handleInsertBankTransaction, handleGetBankRecordList } = useMaybank();

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

      <Form onFinish={handleGetBankRecordList} form={form2}>
        <Row>
          <Col xs={6}>
            <Device list={allBankList} label="bank" selectAll={false} required />

            <CommonButton text="Search" />
          </Col>
        </Row>
      </Form>

      <Table dataSource={bankRecordList} columns={bankRecordColumns} />
      {/* </> */}
    </Spin>
  );
};

export default Maybank;
