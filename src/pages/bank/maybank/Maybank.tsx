import { Button, Col, DatePicker, Divider, Form, Row, Select, Spin, Table } from "antd";
import CommonButton from "../../../components/CommonButton";
import { useMaybank } from "./hook/useMaybank";
import "./maybank.scss";
const { RangePicker } = DatePicker;

const Maybank = () => {
  const { form, form2, contextHolder, isLoading, initialValues, setBankSelected, selectedCompany, bankRecordColumns, allBankList, bankRecordList, handleInsertBankTransaction, handleGetBankRecordList } = useMaybank();

  return (
    <Spin spinning={isLoading}>
      {contextHolder}

      <div className="" style={{ color: "red", fontWeight: "600" }}>
        When the sheet do not open , can click this link :{" "}
        <span style={{ color: "blue", fontWeight: "700", cursor: "point", textDecoration: "underline", fontSize: "20px" }} onClick={() => window.open(selectedCompany?.googleSheetUrl)}>
          Google Sheet Link
        </span>
      </div>

      {selectedCompany?.googleSheetUrl ? <iframe src={selectedCompany?.googleSheetUrl} width="100%" height={600} /> : "Please contact admin to open google sheet"}

      <Form layout="vertical" onFinish={handleInsertBankTransaction} form={form}>
        <Row gutter={[20, 10]}>
          {allBankList?.map((items) => {
            return items?.bankCode === "CIMB" ? (
              <>
                <Col xs={3} key={items.srno}>
                  <Form.Item>
                    <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected(items.bankCode)}>
                      {items?.bankCode}
                    </Button>
                  </Form.Item>
                </Col>
                <Col xs={3} key={items.srno}>
                  <Form.Item>
                    <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected("CIMB NEW BIZ")}>
                      CIMB NEW BIZ
                    </Button>
                  </Form.Item>
                </Col>
                <Col xs={3} key={items.srno}>
                  <Form.Item>
                    <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected("CIMB OLD BIZ")}>
                      CIMB OLD BIZ
                    </Button>
                  </Form.Item>
                </Col>
              </>
            ) : items?.bankCode === "PBB" ? (
              <>
                <Col xs={3} key={items.srno}>
                  <Form.Item>
                    <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected(items.bankCode)}>
                      {items?.bankCode}
                    </Button>
                  </Form.Item>
                </Col>
                <Col xs={3} key={items.srno}>
                  <Form.Item>
                    <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected("PBB TOKEN")}>
                      PBB TOKEN
                    </Button>
                  </Form.Item>
                </Col>
              </>
            ) : items?.bankCode === "RHB" ? (
              <>
                <Col xs={3} key={items.srno}>
                  <Form.Item>
                    <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected(items.bankCode)}>
                      {items?.bankCode}
                    </Button>
                  </Form.Item>
                </Col>
                <Col xs={3} key={items.srno}>
                  <Form.Item>
                    <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected("RHB TOKEN")}>
                      RHB TOKEN
                    </Button>
                  </Form.Item>
                </Col>
              </>
            ) : items?.bankCode === "AFFIN" ? (
              <>
                <Col xs={3} key={items.srno}>
                  <Form.Item>
                    <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected(items.bankCode)}>
                      {items?.bankCode}
                    </Button>
                  </Form.Item>
                </Col>
                <Col xs={3} key={items.srno}>
                  <Form.Item>
                    <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected("AFFIN MAX")}>
                      AFFIN MAX
                    </Button>
                  </Form.Item>
                </Col>
              </>
            ) : (
              <Col xs={3} key={items.srno}>
                <Form.Item>
                  <Button htmlType="submit" className={`bank-button-${items.bankCode}`} style={{ width: "100%", fontWeight: "600" }} onClick={() => setBankSelected(items.bankCode)}>
                    {items?.bankCode}
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
            {/* <Device list={allBankList} label="bank" selectAll={false} required /> */}
            <Form.Item label="bank" name="bank">
              <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={"select bank"} optionFilterProp="label">
                {allBankList?.map((items) => {
                  return <Select.Option value={items.bankCode}>{items.bankCode}</Select.Option>;
                })}
              </Select>
            </Form.Item>
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
