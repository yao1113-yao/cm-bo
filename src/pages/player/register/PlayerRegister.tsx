import { Card, Col, Divider, Form, Input, InputNumber, Row, Table } from "antd";
import { usePlayerRegister } from "./hook/usePlayerRegister";
import GameProvider from "../../../components/GameProvider";
import CommonButton from "../../../components/CommonButton";
import { useState } from "react";
import ExpandData from "./ExpandData";

const PlayerRegister = () => {
  const { t, userInfo, contextHolder, isLoading, allGameList, columns, apiData, handleRegisterPlayer } = usePlayerRegister();
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  function handleTableRowExpand(expended: any, record: any) {
    const keys = [];

    if (expended) {
      keys.push(record.srno);
    }

    setExpandedRowKeys(keys);
  }
  return (
    <>
      {contextHolder}

      <Card title={t("registerPlayer")} loading={isLoading}>
        <Form layout="vertical" onFinish={handleRegisterPlayer}>
          <Row gutter={10}>
            <Col xs={4}>
              <GameProvider list={allGameList} required={true} selectAll={false} label="game" />
            </Col>
            {userInfo?.userType !== 3 && (
              <Col xs={4}>
                <Form.Item label={t("score")} name="score" rules={[{ required: userInfo?.userType === 2, message: t("pleaseSelect") }]}>
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            )}

            <Col xs={4}>
              <Form.Item
                label={t("countPlayer")}
                name="countPlayer"
                rules={[
                  { required: true, message: t("pleaseSelect") },
                  { min: 1, type: "number", message: t("cannotLessThan1") },
                  { max: 10, type: "number", message: t("cannotMoreThan10") },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("name")} name="name">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("phone")} name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("remark")} name="remark">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <CommonButton text="submit" />
        </Form>
      </Card>

      {userInfo?.userType === 3 && (
        <>
          <Divider />

          <Table
            columns={columns}
            dataSource={apiData}
            scroll={{ x: true }}
            rowHoverable={false}
            rowKey="srno"
            expandable={{
              expandedRowKeys: expandedRowKeys,
              onExpand: handleTableRowExpand,
              expandedRowRender: (record) => {
                if (record.srno === expandedRowKeys[0]) {
                  return (
                    <div>
                      <ExpandData record={record} />
                    </div>
                  );
                }
              },
            }}
          ></Table>
        </>
      )}
    </>
  );
};

export default PlayerRegister;
