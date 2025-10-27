import CommonButton from "../../../components/CommonButton";
import { useBankRecord } from "./hook/useBankRecord";
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Select, Statistic, Table } from "antd";
import { DownCircleOutlined, LeftCircleOutlined, DollarOutlined, FileOutlined } from "@ant-design/icons";
import OpenBankRecord from "./modal/OpenbankRecord";
import EditTransaction from "./modal/EditTransaction";
import { handleExportExcel } from "../../../function/CommonFunction";

const { RangePicker } = DatePicker;
const BankRecord = () => {
  const { t, userInfo, companyList, userInput, form, contextHolder, allBankList, isLoading, apiData, apiData2, openEditTransaction, setOpenEditTransaction, columns, initialValues, handleGetBankRecordMarketingList, handleSearchByFilter, rowClassName, pagination, handleTableChange, selectedPendingDeposit, openBankRecord, setOpenBankRecord, messageApi, isCheckAllAmount, setIsCheckAllAmount } = useBankRecord();

  return (
    <Card>
      {contextHolder}

      <Form layout="vertical" onFinish={handleGetBankRecordMarketingList} initialValues={initialValues} form={form}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={t("searchMktCreateDate")} name="searchDate">
              <RangePicker style={{ width: "100%" }} showTime />
            </Form.Item>
          </Col>
          {(userInfo && userInfo?.userType !== 2) ||
            (userInfo?.userType !== 3 && (
              <Col xs={6}>
                <Form.Item label={t("companyID")} name="companyID">
                  <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("companyID")} optionFilterProp="label">
                    <Select.Option value="all">All</Select.Option>
                    {companyList?.map((items) => {
                      return <Select.Option value={items.companyID}>{items.companyID}</Select.Option>;
                    })}
                  </Select>
                </Form.Item>
              </Col>
            ))}

          <Col xs={6}>
            <Form.Item label={t("type")} name="type">
              <Select>
                <Select.Option value="all">ALL</Select.Option>
                <Select.Option value="MAIN">DEPOSIT</Select.Option>
                <Select.Option value="WITHDRAW">WITHDRAW</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* <Col xs={6}>
            <Device list={allBankList} label="bank" selectAll required />
          </Col> */}

          {/* <Col xs={6}>
            <Form.Item label={t("remark")} name="remark">
              <Input />
            </Form.Item>
          </Col> */}
          <Col xs={6}>
            <Form.Item label={t("keyword")} name="keyword">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <CommonButton text="Submit" />
        &nbsp;
        <Button icon={<LeftCircleOutlined />} type="primary" style={{ background: "blue" }} onClick={() => handleSearchByFilter("day")}>
          {t("today")}
        </Button>
        &nbsp;
        <Button icon={<DownCircleOutlined />} type="primary" style={{ background: "black" }} onClick={() => handleSearchByFilter("yesterday")}>
          {t("yesterday")}
        </Button>
        &nbsp;
        <Button icon={<FileOutlined />} type="primary" style={{ background: "green", marginLeft: "10px" }} onClick={() => handleExportExcel("Deposit Withdraw Record", userInput, apiData)}>
          {t("Export Excel")}
        </Button>
      </Form>

      <Divider>Bank Record</Divider>

      <Row style={{ paddingBottom: "20px" }}>
        <Col xs={3}>
          <Statistic title="Total Deposit" value={apiData2?.totalDeposit} prefix={<DollarOutlined />} valueStyle={{ color: "green" }} />
        </Col>
        <Col xs={3}>
          <Statistic title="Total Withdraw" value={apiData2?.totalWithdraw} prefix={<DollarOutlined />} valueStyle={{ color: "red" }} />
        </Col>
        <Col xs={3}>
          <Statistic title="Total Bonus" value={apiData2?.totalBonus} prefix={<DollarOutlined />} valueStyle={{ color: "red" }} />
        </Col>
        <Col xs={3}>
          <Statistic title="Total Profit" value={apiData2?.totalProfit} prefix={<DollarOutlined />} valueStyle={{ color: apiData2?.totalProfit ?? 0 < 0 ? "red" : apiData2?.totalProfit ?? 0 > 0 ? "green" : "black" }} />
        </Col>

        <Col xs={3}>
          <Statistic title="Total Marketing BankIn" value={apiData2?.totalMktBankIn} prefix={<DollarOutlined />} valueStyle={{ color: apiData2?.totalMktBankIn === apiData2?.totalDeposit ? "green" : "red" }} />
        </Col>

        <Col xs={3}>
          <Statistic title="Total Marketing BankOut" value={apiData2?.totalMktBankOut} prefix={<DollarOutlined />} valueStyle={{ color: apiData2?.totalMktBankOut === apiData2?.totalWithdraw ? "green" : "red" }} />
        </Col>
      </Row>

      <Card loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="" scroll={{ x: true }} rowClassName={rowClassName} rowHoverable={false} pagination={pagination} onChange={handleTableChange} />
      </Card>

      {openBankRecord && <OpenBankRecord messageApi={messageApi} isCheckAllAmount={isCheckAllAmount} allBankList={allBankList} setIsCheckAllAmount={setIsCheckAllAmount} selectedPendingDeposit={selectedPendingDeposit} openBankRecord={openBankRecord} setOpenBankRecord={setOpenBankRecord} handleGetBankRecordMarketingList={handleGetBankRecordMarketingList} />}

      {openEditTransaction && <EditTransaction messageApi={messageApi} openEditTransaction={openEditTransaction} allBankList={allBankList} selectedPendingDeposit={selectedPendingDeposit} setOpenEditTransaction={setOpenEditTransaction} handleGetBankRecordMarketingList={handleGetBankRecordMarketingList} />}
    </Card>
  );
};

export default BankRecord;
