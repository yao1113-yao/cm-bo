import { Card, Col, DatePicker, Divider, Form, Row, Select, Table } from "antd";
import CommonButton from "../../../components/CommonButton";
import { useDeviceCase } from "./hook/useDeviceCase";
import { useState } from "react";
import ExpandData from "./ExpandData";
const { RangePicker } = DatePicker;

const DeviceCase = () => {
  const { t, form, isLoading, initialValues, userInput, columns, apiData, allDeviceList, handleGetTeamCase } = useDeviceCase();

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  function handleTableRowExpand(expended: any, record: any) {
    const keys = [];

    if (expended) {
      keys.push(record.mDevice);
    }

    setExpandedRowKeys(keys);
  }
  return (
    <Card>
      <Form layout="vertical" initialValues={initialValues} form={form} onFinish={handleGetTeamCase}>
        <Row gutter={20}>
          <Col xs={6}>
            <Form.Item label={t("searchDate")} name="searchDate">
              <RangePicker style={{ width: "100%" }} showTime />
            </Form.Item>
          </Col>

          <Col xs={6}>
            <Form.Item label={t("deviceID")} name="deviceID">
              <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("companyID")} optionFilterProp="label">
                <Select.Option value="all">All</Select.Option>
                {allDeviceList?.map((items) => {
                  return <Select.Option value={items.item}>{items.item}</Select.Option>;
                })}
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

      <Divider>Device Case</Divider>

      <Card loading={isLoading}>
        <Table
          columns={columns}
          dataSource={apiData}
          rowKey="mDevice"
          scroll={{ x: true }}
          rowHoverable={false}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: handleTableRowExpand,
            expandedRowRender: (record) => {
              if (record.mDevice === expandedRowKeys[0]) {
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

export default DeviceCase;
