import { Card, Col, Divider, Form, Input, Row, Table } from "antd";
import StatusList from "../../../../components/StatusList";
import CommonButton from "../../../../components/CommonButton";
import { useList } from "./hook/useList";

const List = () => {
  const { t, contextHolder, isLoading, apiData, initialValues, columns, handleGetUserList } = useList();

  return (
    <>
      {contextHolder}
      <Card title={t("searchUserList")}>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetUserList}>
          <Row gutter={20}>
            <Col xs={24} lg={12} xl={6}>
              <Form.Item label={t("userID")} name="searchUserID">
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

      <Card title={t("userList")} loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }}></Table>
      </Card>

      {/* edit player */}
      {/* {openEditPlayer && (
        <Modal open={openEditPlayer} onCancel={() => setOpenEditPlayer(false)} footer={null} closable={false} title={t("editPlayerDetails")}>
          <Form initialValues={editPlayerRecord} layout="vertical">
            <Form.Item label={t("game")} name="game">
              <Input disabled />
            </Form.Item>
            <Form.Item label={t("loginID")} name="loginID">
              <Input disabled />
            </Form.Item>
            <Form.Item label={t("password")} name="password">
              <Input />
            </Form.Item>
            <Form.Item label={t("name")} name="name">
              <Input />
            </Form.Item>
            <Form.Item label={t("phone")} name="phone">
              <Input />
            </Form.Item>
            <Form.Item label={t("remark")} name="remark">
              <Input />
            </Form.Item>
            <CommonButton text="submit" />
          </Form>
        </Modal>
      )} */}

      {/* update balance player */}
      {/* {openUpdateBalancePlayer && (
        <Modal open={openUpdateBalancePlayer} onCancel={() => setOpenUpdateBalancePlayer(false)} footer={null} closable={false} title={t("updateBalancePlayer")}>
          <Form initialValues={updateBalanceRecord} layout="vertical">
            <Form.Item label={t("game")} name="game">
              <Input disabled />
            </Form.Item>
            <Form.Item label={t("loginID")} name="loginID">
              <Input disabled />
            </Form.Item>

            <Form.Item label={t("balance")} name="balance">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <CommonButton text="submit" />
          </Form>
        </Modal>
      )} */}
    </>
  );
};

export default List;
