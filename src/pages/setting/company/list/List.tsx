import { Card, Col, Divider, Form, Input, Row, Table } from "antd";
import StatusList from "../../../../components/StatusList";
import CommonButton from "../../../../components/CommonButton";
import { useList } from "./hook/useList";

const List = () => {
  const { t, contextHolder, isLoading, apiData, initialValues, columns, handleGetUserList } = useList();

  return (
    <>
      {contextHolder}
      <Card title={t("searchCompanyList")}>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetUserList}>
          <Row gutter={20}>
            <Col xs={24} lg={12} xl={6}>
              <Form.Item label={t("companyID")} name="searchCompanyID">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12} xl={6}>
              <StatusList selectAll required />
            </Col>
          </Row>

          <Form.Item>
            <CommonButton text="search" />
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      <Card title={t("companyList")} loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }}></Table>
      </Card>
    </>
  );
};

export default List;
