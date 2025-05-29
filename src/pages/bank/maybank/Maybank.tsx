import { Button, Col, Divider, Form, Row, Select, Space, Spin, Table } from "antd";
import CommonButton from "../../../components/CommonButton";
import { useMaybank } from "./hook/useMaybank";
import Device from "../../../components/Device";

const Maybank = () => {
  const { form, contextHolder, companyList, isLoading, setBankSelected, selectedCompany, handleOnChangeSelectedCompany, bankRecordColumns, allBankList, bankRecordList, handleInsertBankTransaction, handleGetBankRecordList } = useMaybank();

  return (
    <Spin spinning={isLoading}>
      {contextHolder}
      <Row>
        <Col xs={6}>
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
      </Row>

      {selectedCompany && (
        <>
          {selectedCompany?.googleSheetUrl ? <iframe src={selectedCompany?.googleSheetUrl} width="100%" height={600} /> : "Please contact admin to open google sheet"}

          <Form layout="vertical" onFinish={handleInsertBankTransaction} form={form}>
            <Row gutter={20}>
              <Col xs={3}>
                <Button style={{ width: "100%", backgroundColor: "yellow", fontWeight: "600" }} htmlType="submit" onClick={() => setBankSelected("MBB")}>
                  MBB
                </Button>
              </Col>
              <Col xs={3}>
                <Button style={{ width: "100%", backgroundColor: "#91caff", fontWeight: "600" }} htmlType="submit" onClick={() => setBankSelected("HLB")}>
                  HLB
                </Button>
              </Col>
              <Col xs={3}>
                <Button style={{ width: "100%", backgroundColor: "#87e8de", fontWeight: "600" }} htmlType="submit" onClick={() => setBankSelected("PMY")}>
                  PMY
                </Button>
              </Col>
              <Col xs={3}>
                <Button style={{ width: "100%", backgroundColor: "#ff7875", fontWeight: "600" }} htmlType="submit" onClick={() => setBankSelected("CIMB")}>
                  CIMB
                </Button>
              </Col>
              <Col xs={3}>
                <Button style={{ width: "100%", backgroundColor: "#f5222d", fontWeight: "600", color: "white" }} htmlType="submit" onClick={() => setBankSelected("PBB")}>
                  PBB
                </Button>
              </Col>
              <Col xs={3}>
                <Button style={{ width: "100%", backgroundColor: "#91caff", fontWeight: "600", color: "red" }} htmlType="submit" onClick={() => setBankSelected("RHB")}>
                  RHB
                </Button>
              </Col>
              <Col xs={3}>
                <Button style={{ width: "100%", backgroundColor: "#91caff", fontWeight: "600" }} htmlType="submit" onClick={() => setBankSelected("AFFIN")}>
                  AFFIN
                </Button>
              </Col>
            </Row>
          </Form>

          <Divider>Bank Record</Divider>

          <Form onFinish={handleGetBankRecordList}>
            <Row>
              <Col xs={6}>
                <Device list={allBankList} label="bank" selectAll={false} required />

                <CommonButton text="Search" />
              </Col>
            </Row>
          </Form>

          <Table dataSource={bankRecordList} columns={bankRecordColumns} />
        </>
      )}
    </Spin>
  );
};

export default Maybank;
