import { Card, Col, Divider, Form, Input, InputNumber, Modal, Row, Table } from "antd";

import { usePlayerList } from "./hook/usePlayerList";
import CommonButton from "../../../components/CommonButton";
import StatusList from "../../../components/StatusList";

const PlayerList = () => {
  const { t, isLoading, openEditPlayer, setOpenEditPlayer, editPlayerRecord, openUpdateBalancePlayer, setOpenUpdateBalancePlayer, updateBalanceRecord, apiData, userInput, apiDataPagination, initialValues, columns, handleGetPlayerList } = usePlayerList();
  console.log(openUpdateBalancePlayer);
  return (
    <>
      <Card title={t("playerList")}>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleGetPlayerList}>
          <Row gutter={20}>
            <Col xs={24} lg={12} xl={6}>
              <Form.Item label={t("loginID")} name="loginID">
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

      <Card title={t("playerList")} loading={isLoading}>
        <Table
          columns={columns}
          dataSource={apiData}
          rowKey="srno"
          scroll={{ x: true }}
          pagination={{
            current: apiDataPagination?.currentPage,
            total: apiDataPagination?.total,
            showTotal: (total) => `Total ${total} Items`,
            pageSize: apiDataPagination?.perPage,
            onChange: (page, pageSize) => handleGetPlayerList(userInput, page, pageSize),
          }}
        ></Table>
      </Card>

      {/* edit player */}
      {openEditPlayer && (
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
      )}

      {/* update balance player */}
      {openUpdateBalancePlayer && (
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
      )}
    </>
  );
};

export default PlayerList;
