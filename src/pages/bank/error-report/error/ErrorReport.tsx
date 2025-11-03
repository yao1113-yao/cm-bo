import { Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Table } from "antd";
import GameProvider from "../../../../components/GameProvider";
import CommonButton from "../../../../components/CommonButton";
import Staff from "../../../../components/Staff";
import { useErrorReport } from "./hook/useErrorReport";
import Device from "../../../../components/Device";
import OpenBankRecord from "../bank/modal/OpenBankRecord";
import KioskErrorMarketing from "./modal/KioskErrorMarketing";

const { RangePicker } = DatePicker;

const ErrorReport = () => {
  const { t, messageApi, userInfo, companyList, isLoading, contextHolder, form, allGameList, allStaffList, apiData, apiData2, selectedPendingDeposit, openBankRecord, setOpenBankRecord, openErrorMarketingRecord, setOpenErrorMarketingRecord, selectedKioskError, type, allBankList, initialValues, columns, bankColumns, handleInsertError, handleGetBankErrorReport, handleGetKioskErrorReport, handleOnChangeType, handleOnChangeAmount } = useErrorReport();

  return (
    <div>
      {contextHolder}
      {userInfo && userInfo?.userType === 2 && (
        <Card title={t("addError")} loading={isLoading}>
          <Form layout="vertical" form={form} onFinish={handleInsertError}>
            <Row gutter={20}>
              <Col xs={6}>
                <Form.Item label={t("type")} name="type" rules={[{ required: true }]}>
                  <Select onChange={handleOnChangeType} defaultActiveFirstOption={true} filterOption={(inputValue: any, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("type")} optionFilterProp="label">
                    <Select.Option value="Kiosk Error">Kiosk Error</Select.Option>
                    <Select.Option value="Bank Error">Bank Error</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={6}>
                <Staff list={allStaffList} required selectAll={false} label="staffSrno" />
              </Col>
              {type === "Kiosk Error" ? (
                <>
                  <Col xs={6}>
                    <GameProvider list={allGameList} required={true} selectAll={false} label="gameName" />
                  </Col>
                  <Col xs={6}>
                    <Form.Item label={t("remark")} name="remark" required>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={6}>
                    <Form.Item label={t("point")} name="point" required>
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={6}>
                    <Device list={allBankList} label="bankCode" selectAll={false} required />
                  </Col>
                  <Col xs={6}>
                    <Form.Item label={t("remark")} name="remark" required>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={6}>
                    <Form.Item label={t("Original Withdraw")} name="oriWithdraw" required>
                      <InputNumber style={{ width: "100%" }} onChange={handleOnChangeAmount} />
                    </Form.Item>
                  </Col>
                  <Col xs={6}>
                    <Form.Item label={t("Wrong Withdraw")} name="wrongWithdraw" required>
                      <InputNumber style={{ width: "100%" }} onChange={handleOnChangeAmount} />
                    </Form.Item>
                  </Col>
                  <Col xs={6}>
                    <Form.Item label={t("Error Withdraw")} name="errorWithdraw" required>
                      <InputNumber style={{ width: "100%" }} disabled />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>

            <div style={{ fontWeight: "500", color: "red" }}>
              *Reminder: &nbsp;<span style={{ fontSize: "18px", color: "green" }}>Positve</span> is add point to kiosk , <span style={{ fontSize: "18px", color: "green" }}> Negative</span> is deduct point to kiosk
            </div>

            <CommonButton text="Add" />
          </Form>
        </Card>
      )}
      <Divider>Bank Error Report</Divider>
      <Card>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetBankErrorReport}>
          <Row gutter={20}>
            <Col xs={6}>
              <Form.Item label={t("searchDate")} name="searchDate">
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
              <Staff list={allStaffList} required={true} selectAll={true} label="staffSrno" />
            </Col>
            <Col xs={6}>
              <Device list={allBankList} label="bankCode" selectAll required />
            </Col>
            <Col xs={6}>
              <Form.Item label={t("remark")} name="remark" required>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <CommonButton text="Search" />
        </Form>
        <Table columns={bankColumns} dataSource={apiData2} rowClassName={(_record, index) => (index % 2 === 0 ? "row-highlight-1" : "row-highlight-2")} rowHoverable={false}></Table>
        {/* open bank list assign bank */}
        {openBankRecord && <OpenBankRecord messageApi={messageApi} selectedPendingDeposit={selectedPendingDeposit} openBankRecord={openBankRecord} setOpenBankRecord={setOpenBankRecord} handleGetBankErrorReport={handleGetBankErrorReport} />}
      </Card>

      <Divider>Kiosk Error Report</Divider>
      <Card>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetKioskErrorReport}>
          <Row gutter={20}>
            <Col xs={6}>
              <Form.Item label={t("searchDate")} name="searchDate">
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
              <Staff list={allStaffList} required={true} selectAll={true} label="staffSrno" />
            </Col>

            {/* <Col xs={6}>
              <Form.Item label={t("type")} name="type" rules={[{ required: true }]}>
                <Select onChange={handleOnChangeType} defaultActiveFirstOption={true} filterOption={(inputValue: any, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("type")} optionFilterProp="label">
                  <Select.Option value="Kiosk Error">Kiosk Error</Select.Option>
                  <Select.Option value="Bank Error">Bank Error</Select.Option>
                </Select>
              </Form.Item>
            </Col> */}
            {/* <Col xs={6}>
              <GameProvider list={allGameList} required={true} selectAll={true} label="gameName" />
            </Col> */}

            <Col xs={6}>
              <GameProvider list={allGameList} required={true} selectAll={false} label="gameName" />
            </Col>

            <Col xs={6}>
              <Form.Item label={t("remark")} name="remark" required>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <CommonButton text="Search" />
        </Form>
        {/* <Divider>Bank Error Report</Divider>
        <Table columns={bankColumns} dataSource={apiData2} rowClassName={(_record, index) => (index % 2 === 0 ? "row-highlight-1" : "row-highlight-2")} rowHoverable={false}></Table> */}

        <Table columns={columns} dataSource={apiData} rowClassName={(_record, index) => (index % 2 === 0 ? "row-highlight-1" : "row-highlight-2")} rowHoverable={false}></Table>

        {openErrorMarketingRecord && <KioskErrorMarketing messageApi={messageApi} selectedKioskError={selectedKioskError} openErrorMarketingRecord={openErrorMarketingRecord} setOpenErrorMarketingRecord={setOpenErrorMarketingRecord} handleGetBankErrorReport={handleGetBankErrorReport} />}
      </Card>
    </div>
  );
};

export default ErrorReport;
